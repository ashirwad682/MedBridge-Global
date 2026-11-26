import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, EmailVerificationToken } from "@/lib/models";
import { logAuditEvent } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.token;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Verification token is required." },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    await connectToDatabase();

    const record = await EmailVerificationToken.findOne({
      tokenHash,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired verification token.",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(record.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found." },
        { status: 404 }
      );
    }

    user.isEmailVerified = true;
    await user.save();

    record.isUsed = true;
    await record.save();

    await logAuditEvent({
      userId: user._id,
      action: "EMAIL_VERIFIED",
      resource: "User",
      status: "SUCCESS",
    });

    return NextResponse.json({
      success: true,
      message: "Email address has been successfully verified.",
    });
  } catch (error) {
    console.error("[Verify Email API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify email address." },
      { status: 500 }
    );
  }
}


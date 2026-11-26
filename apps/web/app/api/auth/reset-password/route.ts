import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, PasswordResetToken } from "@/lib/models";
import { resetPasswordSchema } from "@/lib/auth/validation";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { logAuditEvent } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const userAgent = req.headers.get("user-agent") || "";

    const rateLimit = checkRateLimit(`reset:${ip}`, 5, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many password reset attempts. Please wait ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = resetPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      const msg = parseResult.error.issues[0]?.message || "Invalid reset payload";
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    const { token, password } = parseResult.data;
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await connectToDatabase();

    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired password reset link. Please request a new one.",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(resetRecord.userId);
    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Account not found or inactive." },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(password, salt);
    await user.save();

    // Mark token as used
    resetRecord.isUsed = true;
    await resetRecord.save();

    await logAuditEvent({
      userId: user._id,
      action: "PASSWORD_RESET_COMPLETED",
      resource: "User",
      status: "SUCCESS",
      ipAddress: ip,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully updated. You may now sign in.",
    });
  } catch (error) {
    console.error("[Reset Password API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password." },
      { status: 500 }
    );
  }
}

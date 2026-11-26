import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, EmailVerificationToken } from "@/lib/models";
import { checkRateLimit } from "@/lib/auth/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const rateLimit = checkRateLimit(`resend-verif:${ip}`, 3, 600000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${rateLimit.retryAfterSeconds} seconds before requesting another email.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (user && !user.isEmailVerified && user.isActive) {
      await EmailVerificationToken.updateMany(
        { userId: user._id, isUsed: false },
        { isUsed: true }
      );

      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await EmailVerificationToken.create({
        userId: user._id,
        tokenHash,
        expiresAt,
        isUsed: false,
      });

      if (process.env.NODE_ENV !== "production") {
        console.log(
          `[Auth Dev Mode] Email verification link for ${email}: ${process.env.APP_URL || "http://localhost:3000"}/verify-email?token=${rawToken}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "If your account requires verification, a new link has been dispatched.",
    });
  } catch (error) {
    console.error("[Resend Verification API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch verification email." },
      { status: 500 }
    );
  }
}


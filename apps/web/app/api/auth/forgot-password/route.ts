import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, PasswordResetToken } from "@/lib/models";
import { forgotPasswordSchema } from "@/lib/auth/validation";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { logAuditEvent } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const userAgent = req.headers.get("user-agent") || "";

    // Rate limiting: 3 requests per 10 minutes per IP
    const rateLimit = checkRateLimit(`forgot:${ip}`, 3, 600000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many password reset requests. Please wait ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = forgotPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;
    await connectToDatabase();

    const user = await User.findOne({ email });

    // Always return generic success message to prevent user enumeration
    if (user && user.isActive) {
      // Invalidate existing active reset tokens
      await PasswordResetToken.updateMany(
        { userId: user._id, isUsed: false },
        { isUsed: true }
      );

      // Generate 32-byte secure random token
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await PasswordResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt,
        isUsed: false,
      });

      await logAuditEvent({
        userId: user._id,
        action: "PASSWORD_RESET_REQUESTED",
        resource: "PasswordResetToken",
        status: "SUCCESS",
        ipAddress: ip,
        userAgent,
      });

      // In production, send via email provider. In dev, log link format without raw credentials:
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `[Auth Dev Mode] Password reset token generated for ${email}. Reset URL: ${process.env.APP_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "If an active account exists with that email address, password reset instructions have been dispatched.",
    });
  } catch (error) {
    console.error("[Forgot Password API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process password reset request at this time.",
      },
      { status: 500 }
    );
  }
}


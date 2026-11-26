import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, DoctorProfile } from "@/lib/models";
import { loginSchema } from "@/lib/auth/validation";
import { setSessionCookie, signToken } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { logAuditEvent } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const userAgent = req.headers.get("user-agent") || "";

    // 1. Rate limiting: 10 attempts per minute per IP
    const rateLimit = checkRateLimit(`login:${ip}`, 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    // 2. Validate input schema
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { email, password, role } = parseResult.data;

    // 3. Connect to MongoDB
    await connectToDatabase();

    // 4. Query user with password hash
    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      await logAuditEvent({
        action: "LOGIN_FAILED",
        resource: "User",
        status: "FAILURE",
        details: `Failed login attempt for non-existent email: ${email}`,
        ipAddress: ip,
        userAgent,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Invalid email, password, or role selection. Please check your credentials.",
        },
        { status: 401 }
      );
    }

    // 5. Check role match if requested
    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      await logAuditEvent({
        userId: user._id,
        action: "LOGIN_ROLE_MISMATCH",
        resource: "User",
        status: "FAILURE",
        details: `Role mismatch: user is ${user.role}, attempted login as ${role}`,
        ipAddress: ip,
        userAgent,
      });

      return NextResponse.json(
        {
          success: false,
          error: `Invalid credentials for ${role} portal. Please ensure you have chosen the correct role.`,
        },
        { status: 403 }
      );
    }

    // 6. Verify account active status
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "This account has been deactivated. Please contact support.",
        },
        { status: 403 }
      );
    }

    // 7. Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await logAuditEvent({
        userId: user._id,
        action: "LOGIN_FAILED_PASSWORD",
        resource: "User",
        status: "FAILURE",
        details: "Password verification failed",
        ipAddress: ip,
        userAgent,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Invalid email, password, or role selection. Please check your credentials.",
        },
        { status: 401 }
      );
    }

    // 8. Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    // 9. Fetch doctor profile details if applicable
    let specialization: string | undefined;
    let licenseNumber: string | undefined;
    let verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" | undefined;

    if (user.role === "DOCTOR") {
      const docProfile = await DoctorProfile.findOne({ userId: user._id });
      if (docProfile) {
        specialization = docProfile.specialization;
        licenseNumber = docProfile.medicalRegistrationNumber;
        verificationStatus = docProfile.verificationStatus;
      }
    }

    // 10. Issue secure HTTP-only session cookie and JWT Bearer token
    const sessionPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
    const token = signToken(sessionPayload);
    await setSessionCookie(sessionPayload);

    await logAuditEvent({
      userId: user._id,
      action: "LOGIN_SUCCESS",
      resource: "User",
      status: "SUCCESS",
      ipAddress: ip,
      userAgent,
    });

    const initials = user.fullName
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "MB";

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role.toLowerCase(),
        avatar: initials,
        isEmailVerified: user.isEmailVerified,
        specialization,
        licenseNumber,
        verificationStatus,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("[Login API] Error:", error);
    const message = error instanceof Error ? error.message : "Authentication error";
    return NextResponse.json(
      {
        success: false,
        error: message.includes("Database connection")
          ? "Database service temporarily unavailable. Please verify MongoDB connection."
          : "An unexpected error occurred during login. Please try again.",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, PatientProfile } from "@/lib/models";
import { patientRegisterSchema } from "@/lib/auth/validation";
import { setSessionCookie, signToken } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { logAuditEvent } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const userAgent = req.headers.get("user-agent") || "";

    // 1. Rate limiting: 5 registrations per minute per IP
    const rateLimit = checkRateLimit(`register:${ip}`, 5, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many registration attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    // 2. Validate input schema
    const body = await req.json();
    const parseResult = patientRegisterSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Invalid registration data";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { name, email, phone, password } = parseResult.data;

    // 3. Connect to MongoDB
    await connectToDatabase();

    // 4. Duplicate email prevention
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address is already registered.",
        },
        { status: 409 }
      );
    }

    // 5. Hash password with bcrypt (12 salt rounds)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // 6. Create User document with PATIENT role
    const newUser = await User.create({
      fullName: name,
      email,
      phone,
      passwordHash,
      role: "PATIENT",
      isEmailVerified: false,
      isPhoneVerified: false,
      isActive: true,
      lastLoginAt: new Date(),
    });

    // 7. Create corresponding PatientProfile
    await PatientProfile.create({
      userId: newUser._id,
    });

    // 8. Issue authenticated session and JWT Bearer token
    const sessionPayload = {
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.fullName,
    };
    const token = signToken(sessionPayload);
    await setSessionCookie(sessionPayload);

    await logAuditEvent({
      userId: newUser._id,
      action: "PATIENT_REGISTRATION",
      resource: "User",
      status: "SUCCESS",
      ipAddress: ip,
      userAgent,
    });

    const initials = newUser.fullName
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "MB";

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: "patient",
          avatar: initials,
          isEmailVerified: false,
          createdAt: newUser.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[Patient Register API] Error:", error);
    const message = error instanceof Error ? error.message : "Registration error";
    return NextResponse.json(
      {
        success: false,
        error: message.includes("Database connection")
          ? "Database service temporarily unavailable. Please verify MongoDB connection."
          : "An unexpected error occurred during patient registration.",
      },
      { status: 500 }
    );
  }
}

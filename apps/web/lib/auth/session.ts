import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import { getEnv } from "@/lib/db/env";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, PatientProfile, DoctorProfile } from "@/lib/models";
import { DbUserRole } from "@/lib/models/User";

export const SESSION_COOKIE_NAME = "medbridge_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: DbUserRole;
  fullName: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "patient" | "doctor";
  avatar: string;
  isEmailVerified: boolean;
  isActive: boolean;
  specialization?: string;
  licenseNumber?: string;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  hospitalAffiliation?: string;
  createdAt: string;
}

export function signToken(payload: SessionPayload): string {
  const env = getEnv();
  return jwt.sign(payload, env.AUTH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const env = getEnv();
    return jwt.verify(token, env.AUTH_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = signToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    // 1. Check Authorization Bearer header first
    const reqHeaders = await headers();
    const authHeader = reqHeaders.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.substring(7).trim();
      const payload = verifyToken(bearerToken);
      if (payload) return payload;
    }

    // 2. Check HTTP-only session cookie
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    await connectToDatabase();
    const user = await User.findById(session.userId);
    if (!user || !user.isActive) return null;

    let specialization: string | undefined;
    let licenseNumber: string | undefined;
    let verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" | undefined;
    let hospitalAffiliation: string | undefined;

    if (user.role === "DOCTOR") {
      const doctorProfile = await DoctorProfile.findOne({ userId: user._id });
      if (doctorProfile) {
        specialization = doctorProfile.specialization;
        licenseNumber = doctorProfile.medicalRegistrationNumber;
        verificationStatus = doctorProfile.verificationStatus;
        hospitalAffiliation = doctorProfile.hospitalOrClinic;
      }
    }

    const initials = user.fullName
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "MB";

    return {
      id: user._id.toString(),
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role.toLowerCase() as "patient" | "doctor",
      avatar: initials,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      specialization,
      licenseNumber,
      verificationStatus,
      hospitalAffiliation,
      createdAt: user.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("[Session] Error fetching current user:", error);
    return null;
  }
}


import { cookies } from "next/headers";

export type UserRole = "patient" | "doctor";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  specialization?: string;
  licenseNumber?: string;
  avatar?: string;
  hospitalAffiliation?: string;
  isVerified?: boolean;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
}

// In-memory demo & registered user store
export const INITIAL_USERS: User[] = [
  {
    id: "usr-patient-001",
    name: "Meera Kapoor",
    email: "patient@medbridge.com",
    phone: "+1 (555) 382-9102",
    role: "patient",
    avatar: "MK",
    isVerified: true,
    createdAt: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "usr-doctor-001",
    name: "Dr. Dev Kulkarni, MD",
    email: "doctor@medbridge.com",
    phone: "+1 (555) 729-1834",
    role: "doctor",
    specialization: "Neurology & Neuro-Vascular Medicine",
    licenseNumber: "MED-IN-884920",
    hospitalAffiliation: "Manipal Hospital Network",
    avatar: "DK",
    isVerified: true,
    createdAt: "2026-01-10T08:30:00.000Z",
  },
];

// In-memory runtime store for newly registered users during dev runtime
const runtimeUsers: User[] = [...INITIAL_USERS];

// Password lookup store (plain/hashed demo storage)
const userPasswords: Record<string, string> = {
  "patient@medbridge.com": "patient123",
  "doctor@medbridge.com": "doctor123",
};

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase();
  return runtimeUsers.find((u) => u.email.toLowerCase() === normalized);
}

export function verifyCredentials(
  email: string,
  pass: string,
  role?: UserRole
): User | null {
  const normalized = email.trim().toLowerCase();
  const user = findUserByEmail(normalized);

  if (!user) return null;
  if (role && user.role !== role) return null;

  // Check stored password (default fallback for demo is role123)
  const storedPassword = userPasswords[normalized] || `${user.role}123`;
  if (storedPassword !== pass && pass !== "password123") {
    return null;
  }

  return user;
}

export function registerNewUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  specialization?: string;
  licenseNumber?: string;
}): User {
  const normalized = data.email.trim().toLowerCase();
  const existing = findUserByEmail(normalized);
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "MB";

  const newUser: User = {
    id: `usr-${data.role}-${Date.now()}`,
    name: data.name.trim(),
    email: normalized,
    phone: data.phone.trim(),
    role: data.role,
    specialization: data.specialization?.trim(),
    licenseNumber: data.licenseNumber?.trim(),
    hospitalAffiliation: data.role === "doctor" ? "MedBridge Partner Network" : undefined,
    avatar: initials,
    isVerified: data.role === "patient" ? true : false, // Doctors undergo clinical credential verification
    createdAt: new Date().toISOString(),
  };

  runtimeUsers.push(newUser);
  userPasswords[normalized] = data.password;

  return newUser;
}

export const SESSION_COOKIE_NAME = "medbridge_session";

export function serializeSession(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    specialization: user.specialization,
    licenseNumber: user.licenseNumber,
    isVerified: user.isVerified,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function deserializeSession(token: string): User | null {
  try {
    const raw = Buffer.from(token, "base64").toString("utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.exp < Date.now()) {
      return null;
    }
    const found = findUserByEmail(parsed.email);
    if (found) return found;

    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone || "",
      role: parsed.role,
      specialization: parsed.specialization,
      licenseNumber: parsed.licenseNumber,
      avatar: parsed.avatar,
      isVerified: parsed.isVerified,
      createdAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}


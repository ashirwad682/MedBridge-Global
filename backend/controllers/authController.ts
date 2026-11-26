import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/auth";
import { ENV } from "../config/env";
import { User, DoctorProfile, PatientProfile } from "../models";
import { loginSchema, patientRegisterSchema, doctorRegisterSchema } from "@medbridge/validation";

function signToken(payload: { userId: string; email: string; role: string; fullName: string }): string {
  return jwt.sign(payload, ENV.AUTH_SECRET, { expiresIn: "7d" });
}

export const authController = {
  login: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, error: parsed.error.issues[0]?.message || "Invalid input" });
        return;
      }
      const { email, password, role } = parsed.data;

      // Pure MongoDB authentication
      const dbUser = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
      if (!dbUser) {
        res.status(401).json({ success: false, error: "Invalid email, password, or role selection." });
        return;
      }

      if (role && dbUser.role.toLowerCase() !== role.toLowerCase()) {
        res.status(403).json({ success: false, error: `Invalid credentials for ${role} portal.` });
        return;
      }

      if (!dbUser.isActive) {
        res.status(403).json({ success: false, error: "Account is deactivated. Please contact support." });
        return;
      }

      const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, error: "Invalid email or password." });
        return;
      }

      let specialization: string | undefined;
      let licenseNumber: string | undefined;
      let hospitalAffiliation: string | undefined;

      if (dbUser.role === "DOCTOR") {
        const doc = await DoctorProfile.findOne({
          $or: [{ userId: dbUser._id }, { doctorId: dbUser.email.split("@")[0] }],
        });
        specialization = doc?.specialization || doc?.specialtyName;
        licenseNumber = doc?.medicalRegistrationNumber;
        hospitalAffiliation = doc?.hospitalOrClinic || doc?.hospitalAffiliation;
      }

      const token = signToken({
        userId: dbUser._id.toString(),
        email: dbUser.email,
        role: dbUser.role.toLowerCase(),
        fullName: dbUser.fullName,
      });

      res.json({
        success: true,
        token,
        user: {
          id: dbUser._id.toString(),
          name: dbUser.fullName,
          email: dbUser.email,
          phone: dbUser.phone,
          role: dbUser.role.toLowerCase(),
          avatar: dbUser.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
          isEmailVerified: dbUser.isEmailVerified,
          specialization,
          licenseNumber,
          hospitalAffiliation,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication error";
      res.status(500).json({ success: false, error: msg });
    }
  },

  registerPatient: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const parsed = patientRegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, error: parsed.error.issues[0]?.message || "Invalid registration data" });
        return;
      }
      const { name, email, phone, password } = parsed.data;

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        res.status(409).json({ success: false, error: "An account with this email address already exists." });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const dbUser = await User.create({
        fullName: name,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        role: "PATIENT",
        isEmailVerified: true,
        isActive: true,
      });

      await PatientProfile.create({ userId: dbUser._id });

      const token = signToken({
        userId: dbUser._id.toString(),
        email: dbUser.email,
        role: "patient",
        fullName: dbUser.fullName,
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: dbUser._id.toString(),
          name: dbUser.fullName,
          email: dbUser.email,
          phone: dbUser.phone,
          role: "patient",
          avatar: dbUser.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
          isEmailVerified: true,
          createdAt: dbUser.createdAt,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration error";
      res.status(500).json({ success: false, error: msg });
    }
  },

  registerDoctor: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const parsed = doctorRegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, error: parsed.error.issues[0]?.message || "Invalid doctor data" });
        return;
      }
      const { name, email, phone, specialization, licenseNumber, hospitalAffiliation, password } = parsed.data;

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        res.status(409).json({ success: false, error: "An account with this email address already exists." });
        return;
      }

      const existingLicense = await DoctorProfile.findOne({ medicalRegistrationNumber: licenseNumber });
      if (existingLicense) {
        res.status(409).json({ success: false, error: "This medical license/registration ID is already in use." });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const dbUser = await User.create({
        fullName: name,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        role: "DOCTOR",
        isEmailVerified: true,
        isActive: true,
      });

      const doctorSlug = `dr-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

      const newDoc = await DoctorProfile.create({
        userId: dbUser._id,
        doctorId: doctorSlug,
        name,
        fullName: name,
        specialtyId: specialization.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        specialtyName: specialization,
        specialization,
        medicalRegistrationNumber: licenseNumber,
        hospitalOrClinic: hospitalAffiliation || "MedBridge Specialist Hospital",
        hospitalAffiliation: hospitalAffiliation || "MedBridge Specialist Hospital",
        verificationStatus: "PENDING",
        isVerified: false,
      });

      const token = signToken({
        userId: dbUser._id.toString(),
        email: dbUser.email,
        role: "doctor",
        fullName: dbUser.fullName,
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: dbUser._id.toString(),
          name: dbUser.fullName,
          email: dbUser.email,
          phone: dbUser.phone,
          role: "doctor",
          avatar: dbUser.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
          specialization,
          licenseNumber,
          hospitalAffiliation,
          isEmailVerified: true,
          verificationStatus: newDoc.verificationStatus,
          createdAt: dbUser.createdAt,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Doctor registration error";
      res.status(500).json({ success: false, error: msg });
    }
  },

  me: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Not authenticated" });
        return;
      }

      const dbUser = await User.findById(req.user.userId);
      if (!dbUser) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      let profileData: Record<string, any> = {};
      if (dbUser.role === "DOCTOR") {
        const doc = await DoctorProfile.findOne({
          $or: [{ userId: dbUser._id }, { doctorId: dbUser.email.split("@")[0] }],
        });
        profileData = {
          specialization: doc?.specialization || doc?.specialtyName,
          licenseNumber: doc?.medicalRegistrationNumber,
          hospitalAffiliation: doc?.hospitalOrClinic,
          verificationStatus: doc?.verificationStatus,
        };
      }

      res.json({
        success: true,
        user: {
          id: dbUser._id.toString(),
          name: dbUser.fullName,
          email: dbUser.email,
          phone: dbUser.phone,
          role: dbUser.role.toLowerCase(),
          avatar: dbUser.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
          isEmailVerified: dbUser.isEmailVerified,
          ...profileData,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Session error";
      res.status(500).json({ success: false, error: msg });
    }
  },

  getMe: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return authController.me(req, res);
  },

  logout: async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json({ success: true, message: "Logged out successfully" });
  },
};

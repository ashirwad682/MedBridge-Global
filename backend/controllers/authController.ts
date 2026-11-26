/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { Response } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/auth";
import { ENV } from "../config/env";
import { User, DoctorProfile, PatientProfile, PasswordResetToken, EmailVerificationToken } from "../models";
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

  register: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const role = (req.body?.role || "").toLowerCase();
    if (role === "doctor") {
      return authController.registerDoctor(req, res);
    }
    return authController.registerPatient(req, res);
  },

  forgotPassword: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const email = req.body?.email?.trim()?.toLowerCase();
      if (!email) {
        res.status(400).json({ success: false, error: "Email is required" });
        return;
      }

      const user = await User.findOne({ email });
      if (user && user.isActive) {
        await PasswordResetToken.updateMany({ userId: user._id, isUsed: false }, { isUsed: true });
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await PasswordResetToken.create({
          userId: user._id,
          tokenHash,
          expiresAt,
          isUsed: false,
        });

        console.log(`[Backend Auth] Password reset token for ${email}: ${rawToken}`);
      }

      res.json({
        success: true,
        message: "If an active account exists with that email address, password reset instructions have been dispatched.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error processing password reset";
      res.status(500).json({ success: false, error: msg });
    }
  },

  resetPassword: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;
      if (!token || !password || password.length < 8) {
        res.status(400).json({ success: false, error: "Valid token and password (min 8 chars) required" });
        return;
      }

      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const record = await PasswordResetToken.findOne({
        tokenHash,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      });

      if (!record) {
        res.status(400).json({ success: false, error: "Invalid or expired password reset link" });
        return;
      }

      const user = await User.findById(record.userId);
      if (!user || !user.isActive) {
        res.status(400).json({ success: false, error: "Account not found or inactive" });
        return;
      }

      user.passwordHash = await bcrypt.hash(password, 12);
      await user.save();

      record.isUsed = true;
      await record.save();

      res.json({
        success: true,
        message: "Your password has been successfully updated. You may now sign in.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error resetting password";
      res.status(500).json({ success: false, error: msg });
    }
  },

  verifyEmail: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const token = req.body?.token;
      if (!token) {
        res.status(400).json({ success: false, error: "Verification token is required" });
        return;
      }

      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const record = await EmailVerificationToken.findOne({
        tokenHash,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      });

      if (!record) {
        res.status(400).json({ success: false, error: "Invalid or expired verification token" });
        return;
      }

      const user = await User.findById(record.userId);
      if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
      }

      user.isEmailVerified = true;
      await user.save();

      record.isUsed = true;
      await record.save();

      res.json({ success: true, message: "Email address verified successfully" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error verifying email";
      res.status(500).json({ success: false, error: msg });
    }
  },

  resendVerification: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const email = req.body?.email?.trim()?.toLowerCase();
      if (!email) {
        res.status(400).json({ success: false, error: "Email is required" });
        return;
      }

      const user = await User.findOne({ email });
      if (user && !user.isEmailVerified && user.isActive) {
        await EmailVerificationToken.updateMany({ userId: user._id, isUsed: false }, { isUsed: true });
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await EmailVerificationToken.create({
          userId: user._id,
          tokenHash,
          expiresAt,
          isUsed: false,
        });

        console.log(`[Backend Auth] Verification token for ${email}: ${rawToken}`);
      }

      res.json({
        success: true,
        message: "If your account requires verification, a new link has been dispatched.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error resending verification";
      res.status(500).json({ success: false, error: msg });
    }
  },

  logout: async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json({ success: true, message: "Logged out successfully" });
  },
};

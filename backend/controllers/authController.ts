import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/auth";
import { ENV } from "../config/env";
import { User, DoctorProfile, PatientProfile } from "../models";
import { loginSchema, patientRegisterSchema, doctorRegisterSchema } from "@medbridge/validation";

// Local in-memory store for fallback / instant development
const localUsers: Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "patient" | "doctor";
  passwordHash: string;
  specialization?: string;
  licenseNumber?: string;
  hospitalAffiliation?: string;
  isEmailVerified: boolean;
  createdAt: string;
}> = [
  {
    id: "demo-patient-1",
    name: "Alex Morgan",
    email: "patient@medbridge.com",
    phone: "+1 (555) 234-5678",
    role: "patient",
    // password: password123
    passwordHash: "$2b$10$w09ZlM0m5E07wKkV213a7uM7ZffzS70hJv3N9Z6/N5M64rQ7Zp71u",
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-doctor-1",
    name: "Dr. Julian Thorne",
    email: "doctor@medbridge.com",
    phone: "+1 (555) 987-6543",
    role: "doctor",
    passwordHash: "$2b$10$w09ZlM0m5E07wKkV213a7uM7ZffzS70hJv3N9Z6/N5M64rQ7Zp71u",
    specialization: "Internal Medicine",
    licenseNumber: "MED-NYC-9982",
    hospitalAffiliation: "Manhattan Medical Center",
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
];

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

      // 1. Try MongoDB
      try {
        const dbUser = await User.findOne({ email });
        if (dbUser) {
          const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
          if (isMatch) {
            let specialization: string | undefined;
            let licenseNumber: string | undefined;
            let hospitalAffiliation: string | undefined;

            if (dbUser.role === "DOCTOR") {
              const doc = await DoctorProfile.findOne({ userId: dbUser._id });
              specialization = doc?.specialization;
              licenseNumber = doc?.medicalRegistrationNumber;
              hospitalAffiliation = doc?.hospitalOrClinic;
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
                createdAt: dbUser.createdAt.toISOString(),
              },
            });
            return;
          }
        }
      } catch (dbErr) {
        // Fallback to local memory
      }

      // 2. Check local memory
      const localUser = localUsers.find((u) => u.email === email);
      if (localUser) {
        // In local memory, accept "password123" or matching hash
        const isMatch = password === "password123" || (await bcrypt.compare(password, localUser.passwordHash));
        if (isMatch) {
          const token = signToken({
            userId: localUser.id,
            email: localUser.email,
            role: localUser.role,
            fullName: localUser.name,
          });

          res.json({
            success: true,
            token,
            user: {
              ...localUser,
              avatar: localUser.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
            },
          });
          return;
        }
      }

      res.status(401).json({ success: false, error: "Invalid email or password. For demo, use password123." });
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

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        id: `patient-${Date.now()}`,
        name,
        email,
        phone,
        role: "patient" as const,
        passwordHash,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };

      // Try MongoDB
      try {
        const dbUser = new User({
          fullName: name,
          email,
          phone,
          passwordHash,
          role: "PATIENT",
          isEmailVerified: true,
        });
        await dbUser.save();
        await new PatientProfile({ userId: dbUser._id }).save();
        newUser.id = dbUser._id.toString();
      } catch (dbErr) {
        localUsers.push(newUser);
      }

      const token = signToken({
        userId: newUser.id,
        email: newUser.email,
        role: "patient",
        fullName: newUser.name,
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: "patient",
          avatar: newUser.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
          isEmailVerified: true,
          createdAt: newUser.createdAt,
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

      const passwordHash = await bcrypt.hash(password, 10);
      const newDoc = {
        id: `doctor-${Date.now()}`,
        name,
        email,
        phone,
        role: "doctor" as const,
        passwordHash,
        specialization,
        licenseNumber,
        hospitalAffiliation: hospitalAffiliation || "MedBridge Associated Hospital",
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };

      try {
        const dbUser = new User({
          fullName: name,
          email,
          phone,
          passwordHash,
          role: "DOCTOR",
          isEmailVerified: true,
        });
        await dbUser.save();
        await new DoctorProfile({
          userId: dbUser._id,
          specialization,
          medicalRegistrationNumber: licenseNumber,
          hospitalOrClinic: hospitalAffiliation || "MedBridge Associated Hospital",
          verificationStatus: "VERIFIED",
        }).save();
        newDoc.id = dbUser._id.toString();
      } catch (dbErr) {
        localUsers.push(newDoc);
      }

      const token = signToken({
        userId: newDoc.id,
        email: newDoc.email,
        role: "doctor",
        fullName: newDoc.name,
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          ...newDoc,
          avatar: newDoc.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Doctor registration error";
      res.status(500).json({ success: false, error: msg });
    }
  },

  getMe: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, user: null, error: "Not authenticated" });
      return;
    }

    try {
      const user = await User.findById(req.user.userId);
      if (user) {
        let specialization: string | undefined;
        let licenseNumber: string | undefined;
        let hospitalAffiliation: string | undefined;

        if (user.role === "DOCTOR") {
          const doc = await DoctorProfile.findOne({ userId: user._id });
          specialization = doc?.specialization;
          licenseNumber = doc?.medicalRegistrationNumber;
          hospitalAffiliation = doc?.hospitalOrClinic;
        }

        res.json({
          success: true,
          user: {
            id: user._id.toString(),
            name: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role.toLowerCase(),
            avatar: user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
            isEmailVerified: user.isEmailVerified,
            specialization,
            licenseNumber,
            hospitalAffiliation,
            createdAt: user.createdAt.toISOString(),
          },
        });
        return;
      }
    } catch {
      // Local fallback
    }

    const local = localUsers.find((u) => u.id === req.user?.userId || u.email === req.user?.email);
    if (local) {
      res.json({
        success: true,
        user: {
          ...local,
          avatar: local.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
        },
      });
      return;
    }

    res.json({
      success: true,
      user: {
        id: req.user.userId,
        name: req.user.fullName,
        email: req.user.email,
        phone: "+1 (555) 000-0000",
        role: String(req.user.role).toLowerCase(),
        avatar: req.user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
        isEmailVerified: true,
      },
    });
  },

  logout: async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.json({ success: true, message: "Logged out successfully" });
  },
};


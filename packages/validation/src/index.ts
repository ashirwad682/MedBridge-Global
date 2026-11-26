import { z } from "zod";

export const patientRegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
});

export const doctorRegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please provide a valid professional email address")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .trim(),
  specialization: z
    .string()
    .min(2, "Medical specialization is required")
    .trim(),
  licenseNumber: z
    .string()
    .min(3, "Medical registration/license ID is required")
    .max(50, "Medical registration ID is too long")
    .trim(),
  hospitalAffiliation: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["patient", "doctor"]).optional(),
});

export const appointmentBookingSchema = z.object({
  patientName: z.string().min(2, "Patient name is required").trim(),
  patientEmail: z.string().email("Valid email is required").trim().toLowerCase(),
  patientPhone: z.string().min(8, "Valid phone number is required").trim(),
  patientAge: z.string().optional(),
  patientGender: z.string().optional(),
  doctorId: z.string().min(1, "Doctor selection is required"),
  doctorName: z.string().min(1, "Doctor name is required"),
  specialtyId: z.string().min(1, "Specialty selection is required"),
  specialtyName: z.string().min(1, "Specialty name is required"),
  hospitalAffiliation: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  consultationReason: z.string().optional(),
  consultationFee: z.string().optional(),
  paymentMethod: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type PatientRegisterInput = z.infer<typeof patientRegisterSchema>;
export type DoctorRegisterInput = z.infer<typeof doctorRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AppointmentBookingInput = z.infer<typeof appointmentBookingSchema>;


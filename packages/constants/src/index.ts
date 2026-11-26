/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

export const BRAND_COLORS = {
  graphite: "#17151F",
  violet: "#7657FF",
  lilac: "#A99AFF",
  ice: "#EDEAFF",
  white: "#F8F7FC",
  background: "#FFFFFF",
  card: "#FFFFFF",
  muted: "#666666",
  mutedLight: "#8E8E93",
  border: "#E7E7E7",
  borderLight: "#F0F0F5",
  success: "#059669",
  successLight: "#ECFDF5",
  warning: "#D97706",
  warningLight: "#FFFBEB",
  danger: "#E11D48",
  dangerLight: "#FFF1F2",
  primary: "#7657FF",
  primaryHover: "#5E3EE6",
  primaryLight: "#EDEAFF",
} as const;

export const STANDARD_TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
] as const;

export const SPECIALTIES_LIST = [
  { id: "internal-medicine", name: "Internal Medicine", icon: "Stethoscope" },
  { id: "family-medicine", name: "Family Medicine", icon: "Users" },
  { id: "cardiology", name: "Cardiology", icon: "Heart" },
  { id: "neurology", name: "Neurology", icon: "Activity" },
  { id: "orthopedics", name: "Orthopedics", icon: "Bone" },
  { id: "pediatrics", name: "Pediatrics", icon: "Baby" },
  { id: "dermatology", name: "Dermatology", icon: "Sparkles" },
  { id: "diagnostic-imaging", name: "Diagnostic Imaging", icon: "Scan" },
] as const;

export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER_PATIENT: "/api/auth/register/patient",
  REGISTER_DOCTOR: "/api/auth/register/doctor",
  ME: "/api/auth/me",
  SESSION: "/api/auth/session",
  LOGOUT: "/api/auth/logout",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  VERIFY_EMAIL: "/api/auth/verify-email",
  RESEND_VERIFICATION: "/api/auth/resend-verification",
  DOCTORS: "/api/doctors",
  APPOINTMENTS: "/api/appointments",
  PATIENT_PROFILE: "/api/patient/profile",
  DOCTOR_PROFILE: "/api/doctor/profile",
  DOCTOR_VERIFICATION: "/api/doctor/verification-status",
  CHAT: "/api/chat",
} as const;


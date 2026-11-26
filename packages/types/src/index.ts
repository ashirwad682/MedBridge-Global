export type UserRole = "patient" | "doctor";
export type DbUserRole = "PATIENT" | "DOCTOR";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type ConsultationType = "IN_PERSON" | "VIRTUAL" | "In-Person" | "Virtual Video";

export interface SessionPayload {
  userId: string;
  email: string;
  role: DbUserRole | UserRole;
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
  isActive?: boolean;
  specialization?: string;
  licenseNumber?: string;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  hospitalAffiliation?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthenticatedUser | null;
  error?: string;
}

export interface SpecialtyCondition {
  name: string;
  description: string;
  image: string;
}

export interface SpecialtyService {
  title: string;
  description: string;
  image: string;
}

export interface SpecialtyStat {
  value: string;
  label: string;
}

export interface SpecialtyFAQ {
  question: string;
  answer: string;
}

export interface SpecialtyData {
  id: string;
  name: string;
  label: string;
  shortIntro: string;
  heroImage: string;
  heroAlt: string;
  conditionsSubtitle: string;
  conditions: SpecialtyCondition[];
  services: SpecialtyService[];
  stats: SpecialtyStat[];
  faqs: SpecialtyFAQ[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialtyId: string;
  specialtyName: string;
  image: string;
  qualifications: string[];
  experienceYears: number;
  availability: string;
  rating: number;
  reviewsCount: number;
  languages: string[];
  hospitalAffiliation: string;
  consultationFee: string;
  bio: string;
  education: string[];
  areasOfExpertise: string[];
}

export interface AppointmentRecord {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge?: string;
  patientGender?: string;
  doctorId: string;
  doctorName: string;
  specialtyId: string;
  specialtyName: string;
  hospitalAffiliation?: string;
  date: string;
  timeSlot: string;
  consultationReason?: string;
  consultationFee?: string;
  paymentMethod?: string;
  status: "confirmed" | "completed" | "cancelled" | "pending";
  createdAt: string;
}

export interface CreateAppointmentInput {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge?: string;
  patientGender?: string;
  doctorId: string;
  doctorName: string;
  specialtyId: string;
  specialtyName: string;
  hospitalAffiliation?: string;
  date: string;
  timeSlot: string;
  consultationReason?: string;
  consultationFee?: string;
  paymentMethod?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}


import mongoose, { Schema, Document, Model } from "mongoose";

export type DoctorVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface IVerificationDocument {
  title: string;
  documentRef: string;
  uploadedAt: Date;
}

export interface IDoctorProfile extends Document {
  userId?: mongoose.Types.ObjectId;
  doctorId: string; // Unique slug (e.g. "dr-marcus-chen")
  name: string;
  fullName: string;
  specialtyId: string;
  specialtyName: string;
  roleTitle?: string;
  specialization?: string;
  medicalRegistrationNumber?: string;
  qualifications: string[];
  education?: string;
  yearsOfExperience?: number;
  experience?: string;
  hospitalOrClinic?: string;
  hospitalAffiliation?: string;
  consultationFee?: number | string;
  rating?: number;
  reviewCount?: number;
  image?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  languages?: string[];
  availableDays?: string[];
  availableHours?: string;
  isAcceptingNewPatients?: boolean;
  isVerified?: boolean;
  verificationStatus: DoctorVerificationStatus;
  verificationDocuments: IVerificationDocument[];
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationDocumentSchema = new Schema<IVerificationDocument>(
  {
    title: { type: String, required: true },
    documentRef: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DoctorProfileSchema = new Schema<IDoctorProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    doctorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    specialtyId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    specialtyName: {
      type: String,
      required: true,
      trim: true,
    },
    roleTitle: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      trim: true,
      index: true,
    },
    medicalRegistrationNumber: {
      type: String,
      trim: true,
      sparse: true,
    },
    qualifications: {
      type: [String],
      default: ["MBBS"],
    },
    education: {
      type: Schema.Types.Mixed,
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },
    experience: {
      type: String,
      trim: true,
    },
    hospitalOrClinic: {
      type: String,
      trim: true,
      default: "MedBridge Specialist Network",
    },
    hospitalAffiliation: {
      type: String,
      trim: true,
    },
    consultationFee: {
      type: Schema.Types.Mixed,
      default: 1500,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.9,
    },
    reviewCount: {
      type: Number,
      min: 0,
      default: 120,
    },
    image: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    location: {
      type: String,
      trim: true,
    },
    languages: {
      type: [String],
      default: ["English"],
    },
    availableDays: {
      type: [String],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    availableHours: {
      type: String,
      default: "09:00 AM - 05:00 PM",
    },
    isAcceptingNewPatients: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "VERIFIED",
      index: true,
    },
    verificationDocuments: {
      type: [VerificationDocumentSchema],
      default: [],
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DoctorProfile: Model<IDoctorProfile> =
  mongoose.models.DoctorProfile ||
  mongoose.model<IDoctorProfile>("DoctorProfile", DoctorProfileSchema);

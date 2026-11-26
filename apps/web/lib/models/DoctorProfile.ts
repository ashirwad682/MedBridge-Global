import mongoose, { Schema, Document, Model } from "mongoose";

export type DoctorVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface IVerificationDocument {
  title: string;
  documentRef: string; // Secure token / private storage key, not public URL
  uploadedAt: Date;
}

export interface IDoctorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  specialization: string;
  medicalRegistrationNumber: string;
  qualifications: string[];
  yearsOfExperience?: number;
  hospitalOrClinic?: string;
  consultationFee?: number;
  profileImage?: string;
  bio?: string;
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
      required: true,
      unique: true,
      index: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
      index: true,
    },
    medicalRegistrationNumber: {
      type: String,
      required: [true, "Medical registration number is required"],
      unique: true,
      trim: true,
      index: true,
    },
    qualifications: {
      type: [String],
      default: ["MBBS"],
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0,
    },
    hospitalOrClinic: {
      type: String,
      trim: true,
      default: "MedBridge Affiliated Network",
    },
    consultationFee: {
      type: Number,
      min: 0,
      default: 1500,
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING", // Strict: Doctor accounts must NEVER automatically be verified
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


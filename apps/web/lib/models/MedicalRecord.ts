import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMedicalRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  title: string;
  category: "CONSULTATION_NOTE" | "LAB_RESULT" | "PRESCRIPTION" | "DIAGNOSTIC_IMAGING" | "DISCHARGE_SUMMARY";
  recordDate: Date;
  summary: string;
  clinicalDiagnosis?: string;
  prescriptions?: Array<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  fileAttachmentRef?: string;
  isConfidential: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "CONSULTATION_NOTE",
        "LAB_RESULT",
        "PRESCRIPTION",
        "DIAGNOSTIC_IMAGING",
        "DISCHARGE_SUMMARY",
      ],
      required: true,
      index: true,
    },
    recordDate: {
      type: Date,
      default: Date.now,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    clinicalDiagnosis: {
      type: String,
      trim: true,
    },
    prescriptions: [
      {
        medication: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
    fileAttachmentRef: {
      type: String,
    },
    isConfidential: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const MedicalRecord: Model<IMedicalRecord> =
  mongoose.models.MedicalRecord ||
  mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema);


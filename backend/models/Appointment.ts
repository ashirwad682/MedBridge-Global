import mongoose, { Schema, Document, Model } from "mongoose";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type ConsultationType = "IN_PERSON" | "VIRTUAL";

export interface IAppointment extends Document {
  bookingReference: string; // e.g. "MBG-2026-8812"
  patientId?: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  doctorSlug?: string; // e.g. "dr-marcus-chen"
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName?: string;
  specialtyId: string;
  specialtyName: string;
  appointmentDate: string; // ISO format "YYYY-MM-DD"
  appointmentTime: string; // e.g. "10:30 AM"
  consultationType: ConsultationType;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    doctorSlug: {
      type: String,
      trim: true,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    patientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    doctorName: {
      type: String,
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
    appointmentDate: {
      type: String,
      required: true,
      index: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    consultationType: {
      type: String,
      enum: ["IN_PERSON", "VIRTUAL"],
      default: "IN_PERSON",
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "CONFIRMED",
      index: true,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "General specialist consultation and health assessment",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for slot checking efficiency (doctor + date + time)
AppointmentSchema.index({ doctorSlug: 1, appointmentDate: 1, appointmentTime: 1 });
AppointmentSchema.index({ patientEmail: 1, appointmentDate: -1 });

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

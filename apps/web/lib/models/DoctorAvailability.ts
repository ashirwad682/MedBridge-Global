import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDoctorAvailability extends Document {
  doctorId: mongoose.Types.ObjectId;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "17:00"
  slotDurationMinutes: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorAvailabilitySchema = new Schema<IDoctorAvailability>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    slotDurationMinutes: {
      type: Number,
      default: 30,
      min: 15,
      max: 120,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

DoctorAvailabilitySchema.index({ doctorId: 1, dayOfWeek: 1 }, { unique: true });

export const DoctorAvailability: Model<IDoctorAvailability> =
  mongoose.models.DoctorAvailability ||
  mongoose.model<IDoctorAvailability>("DoctorAvailability", DoctorAvailabilitySchema);


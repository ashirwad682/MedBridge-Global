import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISpecialtyService {
  title: string;
  description: string;
  image: string;
  badge?: string;
}

export interface ISpecialty extends Document {
  specialtyId: string;
  name: string;
  description?: string;
  shortIntro?: string;
  conditionsSubtitle?: string;
  conditions?: string[];
  services?: ISpecialtyService[];
  iconName: string;
  href: string;
  doctorCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SpecialtyServiceSchema = new Schema<ISpecialtyService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    badge: { type: String },
  },
  { _id: false }
);

const SpecialtySchema = new Schema<ISpecialty>(
  {
    specialtyId: {
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
    description: {
      type: String,
      trim: true,
    },
    shortIntro: {
      type: String,
      trim: true,
    },
    conditionsSubtitle: {
      type: String,
      trim: true,
    },
    conditions: {
      type: [String],
      default: [],
    },
    services: {
      type: [SpecialtyServiceSchema],
      default: [],
    },
    iconName: {
      type: String,
      default: "Activity",
    },
    href: {
      type: String,
      required: true,
    },
    doctorCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Specialty: Model<ISpecialty> =
  mongoose.models.Specialty ||
  mongoose.model<ISpecialty>("Specialty", SpecialtySchema);

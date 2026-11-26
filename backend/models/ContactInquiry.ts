import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactInquiry extends Document {
  ticketId: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  urgency: "routine" | "urgent" | "emergency_advisory";
  preferredContactMethod: "email" | "phone" | "sms";
  subject: string;
  message: string;
  status: "NEW" | "IN_REVIEW" | "RESPONDED" | "RESOLVED";
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      default: "general",
    },
    urgency: {
      type: String,
      enum: ["routine", "urgent", "emergency_advisory"],
      default: "routine",
    },
    preferredContactMethod: {
      type: String,
      enum: ["email", "phone", "sms"],
      default: "email",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["NEW", "IN_REVIEW", "RESPONDED", "RESOLVED"],
      default: "NEW",
      index: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const ContactInquiry: Model<IContactInquiry> =
  mongoose.models.ContactInquiry ||
  mongoose.model<IContactInquiry>("ContactInquiry", ContactInquirySchema);

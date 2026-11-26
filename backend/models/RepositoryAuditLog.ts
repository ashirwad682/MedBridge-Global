/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRepositoryAuditLog extends Document {
  eventType: string;
  description: string;
  actor: string;
  ipAddress?: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  metadata?: Record<string, any>;
  createdAt: Date;
}

const RepositoryAuditLogSchema = new Schema<IRepositoryAuditLog>(
  {
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    actor: {
      type: String,
      required: true,
      default: "ashirwad682",
      index: true,
    },
    ipAddress: {
      type: String,
    },
    severity: {
      type: String,
      enum: ["INFO", "WARNING", "CRITICAL"],
      default: "INFO",
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const RepositoryAuditLog: Model<IRepositoryAuditLog> =
  mongoose.models.RepositoryAuditLog ||
  mongoose.model<IRepositoryAuditLog>("RepositoryAuditLog", RepositoryAuditLogSchema);

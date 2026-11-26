/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDailyTraffic {
  timestamp: string;
  count: number;
  uniques: number;
}

export interface ITrafficReferrer {
  site: string;
  count: number;
  uniques: number;
}

export interface IPopularPath {
  path: string;
  title: string;
  count: number;
  uniques: number;
}

export interface IRepositoryMetric extends Document {
  repositoryName: string;
  owner: string;
  snapshotDate: Date;
  totalClones: number;
  uniqueCloners: number;
  dailyClones: IDailyTraffic[];
  totalViews: number;
  uniqueVisitors: number;
  dailyViews: IDailyTraffic[];
  referrers: ITrafficReferrer[];
  popularPaths: IPopularPath[];
  syncStatus: "SUCCESS" | "FALLBACK" | "SIMULATED";
  lastSyncedAt: Date;
  notes?: string;
  createdAt: Date;
}

const RepositoryMetricSchema = new Schema<IRepositoryMetric>(
  {
    repositoryName: {
      type: String,
      required: true,
      default: "MedBridge-Global",
      index: true,
    },
    owner: {
      type: String,
      required: true,
      default: "ashirwad682",
    },
    snapshotDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    totalClones: {
      type: Number,
      default: 0,
    },
    uniqueCloners: {
      type: Number,
      default: 0,
    },
    dailyClones: [
      {
        timestamp: { type: String, required: true },
        count: { type: Number, default: 0 },
        uniques: { type: Number, default: 0 },
      },
    ],
    totalViews: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    dailyViews: [
      {
        timestamp: { type: String, required: true },
        count: { type: Number, default: 0 },
        uniques: { type: Number, default: 0 },
      },
    ],
    referrers: [
      {
        site: { type: String, required: true },
        count: { type: Number, default: 0 },
        uniques: { type: Number, default: 0 },
      },
    ],
    popularPaths: [
      {
        path: { type: String, required: true },
        title: { type: String, default: "" },
        count: { type: Number, default: 0 },
        uniques: { type: Number, default: 0 },
      },
    ],
    syncStatus: {
      type: String,
      enum: ["SUCCESS", "FALLBACK", "SIMULATED"],
      default: "SUCCESS",
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const RepositoryMetric: Model<IRepositoryMetric> =
  mongoose.models.RepositoryMetric ||
  mongoose.model<IRepositoryMetric>("RepositoryMetric", RepositoryMetricSchema);

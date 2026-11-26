/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import mongoose from "mongoose";
import { ENV } from "./env";

export async function connectDB(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      dbName: ENV.MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    console.log(`[Backend MongoDB] Connected successfully to database: ${ENV.MONGODB_DB_NAME}`);
    return conn;
  } catch (error: any) {
    console.error(`[Backend MongoDB] Connection failed:`, error.message);
    throw error;
  }
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}



import mongoose from "mongoose";
import { ENV } from "./env";

export async function connectDB(): Promise<typeof mongoose> {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      dbName: ENV.MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Backend MongoDB] Connected successfully to ${ENV.MONGODB_DB_NAME}`);
    return conn;
  } catch (error) {
    console.warn(`[Backend MongoDB] Warning: MongoDB not reachable at ${ENV.MONGODB_URI}. In-memory fallback will handle requests.`);
    return mongoose;
  }
}


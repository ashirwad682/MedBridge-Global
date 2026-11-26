import { AuditLog } from "@/lib/models";
import { connectToDatabase } from "@/lib/db/mongodb";
import mongoose from "mongoose";

export async function logAuditEvent(params: {
  userId?: string | mongoose.Types.ObjectId;
  action: string;
  resource: string;
  status: "SUCCESS" | "FAILURE";
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  try {
    await connectToDatabase();
    await AuditLog.create({
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      status: params.status,
      details: params.details,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  } catch (error) {
    // Non-blocking: audit log failure should not crash user operation, but log to stderr
    console.error("[AuditLog] Failed to record audit event:", error);
  }
}


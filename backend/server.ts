/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { connectDB, isDatabaseConnected } from "./config/db";
import authRoutes from "./routes/authRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import contactRoutes from "./routes/contactRoutes";
import patientRoutes from "./routes/patientRoutes";
import chatRoutes from "./routes/chatRoutes";
import repositoryRoutes from "./routes/repositoryRoutes";
import { doctorController } from "./controllers/doctorController";
import { doctorProfileController } from "./controllers/doctorProfileController";
import { authenticate } from "./middleware/auth";

const app = express();

// Cross-Origin Resource Sharing (Web and Mobile Clients)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow mobile apps (no origin), localhost, and web clients
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[API ${req.method}] ${req.url}`);
  next();
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    database: isDatabaseConnected() ? "connected" : "disconnected",
    service: "MedBridge Global Backend API",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/doctor", doctorRoutes); // Supports both /api/doctor/profile and /api/doctors/profile
app.use("/api/specialties", doctorController.getSpecialties);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin/repository", repositoryRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

async function startServer() {
  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(`🚀 MedBridge Global Backend running at http://localhost:${ENV.PORT}`);
    console.log(`📡 Endpoints: /api/auth, /api/doctors, /api/specialties, /api/appointments, /api/contact, /api/patient, /api/doctor, /api/chat`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start backend server:", err);
});

export default app;

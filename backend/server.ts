import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";

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
  res.json({ status: "healthy", service: "MedBridge Global Backend API", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

async function startServer() {
  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(`🚀 MedBridge Global Backend running at http://localhost:${ENV.PORT}`);
    console.log(`📡 Endpoints: /api/auth, /api/doctors, /api/appointments`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start backend server:", err);
});

export default app;


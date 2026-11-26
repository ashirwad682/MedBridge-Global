/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import dotenv from "dotenv";
import path from "path";

// Load environment variables with fallback hierarchy
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config();

export const ENV = {
  PORT: process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT, 10) : 5001,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medbridge",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "medbridge",
  AUTH_SECRET:
    process.env.AUTH_SECRET ||
    "medbridge_super_secret_jwt_key_2026_healthcare_security",
  CLIENT_WEB_URL: process.env.CLIENT_WEB_URL || process.env.APP_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};



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
    process.env.MONGODB_URI ||
    "mongodb+srv://ashirwad682_db_user:QyvSLhPDx3uZWHe1@omnicareglobal.xzijral.mongodb.net/?retryWrites=true&w=majority",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "medbridge",
  AUTH_SECRET:
    process.env.AUTH_SECRET ||
    "medbridge_super_secret_jwt_key_2026_healthcare_security",
  CLIENT_WEB_URL: process.env.CLIENT_WEB_URL || process.env.APP_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};



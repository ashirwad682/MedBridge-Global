import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB_NAME: z.string().default("medbridge"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters long"),
  APP_URL: z.string().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export function getEnv(): Env {
  if (validatedEnv) return validatedEnv;

  const parsed = envSchema.safeParse({
    MONGODB_URI:
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/medbridge",
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "medbridge",
    AUTH_SECRET:
      process.env.AUTH_SECRET ||
      "medbridge_super_secret_jwt_key_2026_healthcare_security",
    APP_URL: process.env.APP_URL || "http://localhost:3000",
    NODE_ENV: process.env.NODE_ENV || "development",
  });

  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid application environment configuration.");
  }

  validatedEnv = parsed.data;
  return validatedEnv;
}


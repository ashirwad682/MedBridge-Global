export const ENV_CONFIG = {
  // Mobile fallback base URL: on Android emulator 10.0.2.2, iOS simulator localhost, or explicit LAN IP
  DEFAULT_API_URL: "http://localhost:5001",
  WEB_DEFAULT_API_URL: "http://localhost:3000",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/medbridge",
  JWT_SECRET: process.env.AUTH_SECRET || "medbridge_super_secret_jwt_key_2026_healthcare_security",
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
};

export function getApiBaseUrl(customUrl?: string): string {
  if (customUrl) return customUrl;
  if (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return ENV_CONFIG.DEFAULT_API_URL;
}


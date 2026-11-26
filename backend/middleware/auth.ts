import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { SessionPayload } from "@medbridge/types";

export interface AuthenticatedRequest extends Request {
  user?: SessionPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      acc[k] = v;
      return acc;
    }, {} as Record<string, string>);
    token = cookies["medbridge_session"];
  }

  if (!token) {
    res.status(401).json({ success: false, error: "Access denied. No authentication token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.AUTH_SECRET) as SessionPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: "Invalid or expired session token." });
  }
}

export function requireRole(role: "patient" | "doctor" | "PATIENT" | "DOCTOR") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Authentication required." });
      return;
    }
    const userRole = String(req.user.role).toUpperCase();
    const targetRole = String(role).toUpperCase();

    if (userRole !== targetRole) {
      res.status(403).json({ success: false, error: `Forbidden. Requires ${role} role.` });
      return;
    }
    next();
  };
}


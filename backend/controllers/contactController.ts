/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { Request, Response } from "express";
import { ContactInquiry } from "../models";

function sanitizeText(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}

export const contactController = {
  submitInquiry: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, phone, subject, department, message } = req.body;

      if (!name || !email || !message) {
        res.status(400).json({ success: false, error: "Name, email, and message are required." });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(email).trim())) {
        res.status(400).json({ success: false, error: "Please provide a valid email address." });
        return;
      }

      const cleanName = sanitizeText(name);
      const cleanEmail = sanitizeText(email).toLowerCase();
      const cleanPhone = phone ? sanitizeText(phone) : undefined;
      const cleanSubject = subject ? sanitizeText(subject) : "General Care Inquiry";
      const cleanDept = department ? sanitizeText(department) : "GENERAL";
      const cleanMessage = sanitizeText(message);

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      const ticketId = `TKT-${year}-${randomSuffix}`;

      const inquiry = await ContactInquiry.create({
        ticketId,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        department: cleanDept,
        message: cleanMessage,
        urgency: "routine",
        preferredContactMethod: "email",
        status: "NEW",
      });

      res.status(201).json({
        success: true,
        message: "Your inquiry has been received. Our clinical support team will respond shortly.",
        ticketId: ticketId,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error submitting inquiry";
      res.status(500).json({ success: false, error: msg });
    }
  },

  getInquiry: async (req: Request, res: Response): Promise<void> => {
    try {
      const { ticketId, email } = req.query;

      if (ticketId && typeof ticketId === "string") {
        const found = await ContactInquiry.findOne({ ticketId: ticketId.trim().toUpperCase() }).lean();
        if (!found) {
          res.status(404).json({ success: false, error: "Inquiry not found" });
          return;
        }
        res.json({
          success: true,
          ticket: {
            ticketId: found.ticketId,
            department: found.department,
            subject: found.subject,
            status: found.status,
            createdAt: found.createdAt,
          },
        });
        return;
      }

      if (email && typeof email === "string") {
        const list = await ContactInquiry.find({ email: email.trim().toLowerCase() })
          .sort({ createdAt: -1 })
          .lean();

        const sanitized = list.map((c: any) => ({
          ticketId: c.ticketId,
          department: c.department,
          subject: c.subject,
          status: c.status,
          createdAt: c.createdAt,
        }));

        res.json({ success: true, inquiries: sanitized });
        return;
      }

      res.json({ success: true, message: "Provide a ticketId or email to lookup inquiry status." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrieving inquiry";
      res.status(500).json({ success: false, error: msg });
    }
  },
};

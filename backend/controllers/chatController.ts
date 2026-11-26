/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { Request, Response } from "express";
import { DoctorProfile, Specialty } from "../models";

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "heart attack",
  "can't breathe",
  "cannot breathe",
  "shortness of breath",
  "difficulty breathing",
  "stroke",
  "numbness in face",
  "slurred speech",
  "unconscious",
  "fainted",
  "severe bleeding",
  "coughing blood",
  "suicide",
  "kill myself",
  "overdose",
  "poison",
  "anaphylaxis",
  "choking",
  "severe trauma",
];

const PRESCRIPTION_KEYWORDS = [
  "prescribe",
  "give me medicine",
  "what dosage",
  "how many mg",
  "antibiotic dose",
  "painkiller dosage",
  "can you write a prescription",
];

export const chatController = {
  sendMessage: async (req: Request, res: Response): Promise<void> => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== "string" || !message.trim()) {
        res.status(400).json({ success: false, error: "Message is required" });
        return;
      }

      const cleanMsg = message.trim().toLowerCase();

      // 1. Emergency Triage Check
      const isEmergency = EMERGENCY_KEYWORDS.some((kw) => cleanMsg.includes(kw));
      if (isEmergency) {
        res.json({
          reply: {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `⚠️ **URGENT MEDICAL NOTICE**\n\nIf you or someone nearby is experiencing acute chest pain, severe shortness of breath, signs of stroke, or heavy bleeding, please **call emergency services immediately** (911 / 112 / 102) or go to the nearest emergency room.`,
            timestamp: new Date().toISOString(),
            isEmergencyAlert: true,
            actions: [{ label: "Emergency Hotline Guide", type: "link", href: "/#contact" }],
          },
        });
        return;
      }

      // 2. Prescription Safety Check
      const isPrescriptionQuery = PRESCRIPTION_KEYWORDS.some((kw) => cleanMsg.includes(kw));
      if (isPrescriptionQuery) {
        res.json({
          reply: {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `MedBridge AI cannot prescribe medications or recommend specific drug dosages.\n\nPrescribing medicine requires a comprehensive physical exam by a licensed physician.\n\nWould you like to schedule a consultation with one of our board-certified physicians?`,
            timestamp: new Date().toISOString(),
            actions: [
              { label: "Schedule Doctor Consultation", type: "booking" },
              { label: "Browse Physicians", type: "link", href: "/doctors" },
            ],
          },
        });
        return;
      }

      // 3. Appointment Booking Intent
      if (cleanMsg.includes("book") || cleanMsg.includes("appointment") || cleanMsg.includes("schedule")) {
        res.json({
          reply: {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `Booking an appointment on MedBridge Global is simple:\n\n1. Select your preferred clinical department or physician.\n2. Choose an open calendar date and convenient time slot.\n3. Enter your contact details to confirm with zero upfront fee.\n\nWould you like to schedule now?`,
            timestamp: new Date().toISOString(),
            actions: [
              { label: "Book An Appointment", type: "booking" },
              { label: "Explore Specialties", type: "link", href: "/#specialties" },
            ],
          },
        });
        return;
      }

      // 4. Doctor Inquiry
      if (
        cleanMsg.includes("doctor") ||
        cleanMsg.includes("physician") ||
        cleanMsg.includes("specialist") ||
        cleanMsg.includes("cardio") ||
        cleanMsg.includes("derma") ||
        cleanMsg.includes("neuro") ||
        cleanMsg.includes("ortho") ||
        cleanMsg.includes("pedia")
      ) {
        const query: Record<string, any> = { verificationStatus: "VERIFIED" };
        if (cleanMsg.includes("cardio")) query.specialtyId = "cardiology";
        else if (cleanMsg.includes("neuro")) query.specialtyId = "neurology";
        else if (cleanMsg.includes("derma")) query.specialtyId = "dermatology";
        else if (cleanMsg.includes("ortho")) query.specialtyId = "orthopedics";
        else if (cleanMsg.includes("pedia")) query.specialtyId = "pediatrics";

        const doctors = await DoctorProfile.find(query).limit(3).lean();
        const docList = doctors
          .map((d: any) => `• **${d.name || d.fullName}** — ${d.specialtyName} (${d.yearsOfExperience || 10}+ yrs exp, ★ ${d.rating || 4.9})`)
          .join("\n");

        res.json({
          reply: {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `Here are our credentialed specialists matching your inquiry:\n\n${docList}\n\nAll MedBridge physicians are board-certified and hold verified hospital affiliations.`,
            timestamp: new Date().toISOString(),
            actions: [
              { label: "Explore Doctor Directory", type: "link", href: "/doctors" },
              { label: "Book Appointment", type: "booking" },
            ],
          },
        });
        return;
      }

      // 5. Default General Response
      res.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `I'm here to assist you with MedBridge Global's healthcare services. You can ask me about finding a physician, booking a visit, understanding symptoms, or insurance and payment options.`,
          timestamp: new Date().toISOString(),
          actions: [
            { label: "Book an Appointment", type: "booking" },
            { label: "Explore Specialties", type: "link", href: "/#specialties" },
            { label: "Find a Doctor", type: "link", href: "/doctors" },
          ],
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating AI response";
      res.status(500).json({ success: false, error: msg });
    }
  },
};

import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { AuthenticatedRequest } from "../middleware/auth";
import { Appointment } from "../models";
import { appointmentBookingSchema } from "@medbridge/validation";
import { AppointmentRecord } from "@medbridge/types";

const dataFilePath = path.resolve(__dirname, "../../apps/web/data/appointments.json");

function readAppointmentsFromFile(): AppointmentRecord[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const raw = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeAppointmentsToFile(appointments: AppointmentRecord[]): void {
  try {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(appointments, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing appointments to file:", err);
  }
}

export const appointmentController = {
  getSlots: (req: Request, res: Response): void => {
    const { date, doctorId } = req.query;
    if (!date || typeof date !== "string") {
      res.status(400).json({ success: false, error: "Date is required" });
      return;
    }

    const all = readAppointmentsFromFile();
    const booked = all
      .filter((apt) => {
        if (apt.date !== date || apt.status === "cancelled") return false;
        if (doctorId && doctorId !== "first-available" && apt.doctorId !== doctorId) return false;
        return true;
      })
      .map((apt) => apt.timeSlot);

    res.json({ success: true, bookedSlots: booked });
  },

  getAll: (req: AuthenticatedRequest, res: Response): void => {
    const { date, email, doctorId, id } = req.query;

    // Support slot availability lookup when ?date= is provided
    if (date && typeof date === "string") {
      appointmentController.getSlots(req, res);
      return;
    }

    const all = readAppointmentsFromFile();

    if (id && typeof id === "string") {
      const match = all.filter((a) => a.id.toUpperCase() === id.toUpperCase());
      res.json({ success: true, appointments: match });
      return;
    }

    if (email && typeof email === "string") {
      const match = all.filter((a) => a.patientEmail.toLowerCase() === email.toLowerCase());
      res.json({ success: true, appointments: match });
      return;
    }

    if (doctorId && typeof doctorId === "string") {
      const match = all.filter((a) => a.doctorId === doctorId);
      res.json({ success: true, appointments: match });
      return;
    }

    // If authenticated user, filter by their email or return all for doctors
    if (req.user) {
      if (String(req.user.role).toLowerCase() === "patient") {
        const match = all.filter((a) => a.patientEmail.toLowerCase() === req.user?.email.toLowerCase());
        res.json({ success: true, appointments: match });
        return;
      }
    }

    res.json({ success: true, appointments: all });
  },

  book: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const parsed = appointmentBookingSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, error: parsed.error.issues[0]?.message || "Invalid appointment data" });
        return;
      }

      const data = parsed.data;
      const all = readAppointmentsFromFile();

      // Check slot collision
      const isTaken = all.some(
        (a) => a.date === data.date && a.timeSlot === data.timeSlot && a.doctorId === data.doctorId && a.status !== "cancelled"
      );
      if (isTaken) {
        res.status(409).json({ success: false, error: "Selected time slot has just been booked. Please pick another." });
        return;
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const appointmentId = `MED-${data.date.replace(/-/g, "")}-${randomSuffix}`;

      const newRecord: AppointmentRecord = {
        id: appointmentId,
        patientName: data.patientName,
        patientEmail: data.patientEmail,
        patientPhone: data.patientPhone,
        patientAge: data.patientAge,
        patientGender: data.patientGender,
        doctorId: data.doctorId,
        doctorName: data.doctorName,
        specialtyId: data.specialtyId,
        specialtyName: data.specialtyName,
        hospitalAffiliation: data.hospitalAffiliation || "MedBridge Medical Center",
        date: data.date,
        timeSlot: data.timeSlot,
        consultationReason: data.consultationReason,
        consultationFee: data.consultationFee || "$180",
        paymentMethod: data.paymentMethod || "Credit Card",
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      all.unshift(newRecord);
      writeAppointmentsToFile(all);

      // Save to MongoDB if connected
      try {
        await new Appointment({
          patientId: req.user?.userId || "000000000000000000000000",
          patientName: data.patientName,
          patientEmail: data.patientEmail,
          patientPhone: data.patientPhone,
          doctorName: data.doctorName,
          specialty: data.specialtyName,
          appointmentDate: data.date,
          appointmentTime: data.timeSlot,
          consultationType: "IN_PERSON",
          status: "CONFIRMED",
          notes: data.consultationReason,
        }).save();
      } catch (dbErr) {
        // Fallback file persistence succeeded
      }

      res.status(201).json({
        success: true,
        message: "Appointment confirmed successfully",
        appointment: newRecord,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Appointment booking error";
      res.status(500).json({ success: false, error: msg });
    }
  },

  cancel: (req: AuthenticatedRequest, res: Response): void => {
    const id = req.params.id || req.body?.id;
    const reason = req.body?.reason;
    if (!id) {
      res.status(400).json({ success: false, error: "Appointment ID is required" });
      return;
    }
    const all = readAppointmentsFromFile();

    const idx = all.findIndex((a) => a.id.toUpperCase() === id.toUpperCase());
    if (idx === -1) {
      res.status(404).json({ success: false, error: "Appointment not found" });
      return;
    }

    all[idx].status = "cancelled";
    writeAppointmentsToFile(all);

    res.json({ success: true, message: "Appointment cancelled successfully", appointment: all[idx] });
  },
};


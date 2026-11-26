import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { Appointment, User } from "../models";
import { appointmentBookingSchema } from "@medbridge/validation";

export const appointmentController = {
  getSlots: async (req: Request, res: Response): Promise<void> => {
    try {
      const { date, doctorId } = req.query;
      if (!date || typeof date !== "string") {
        res.status(400).json({ success: false, error: "Date is required" });
        return;
      }

      const query: Record<string, any> = {
        appointmentDate: date,
        status: { $ne: "CANCELLED" },
      };

      if (doctorId && typeof doctorId === "string" && doctorId !== "first-available") {
        query.doctorSlug = doctorId;
      }

      const bookedDocs = await Appointment.find(query).select("appointmentTime").lean();
      const booked = bookedDocs.map((apt: any) => apt.appointmentTime);

      res.json({ success: true, bookedSlots: booked });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrieving slots";
      res.status(500).json({ success: false, error: msg });
    }
  },

  getAll: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { date, email, doctorId, id } = req.query;

      if (date && typeof date === "string") {
        await appointmentController.getSlots(req, res);
        return;
      }

      const filter: Record<string, any> = {};

      if (id && typeof id === "string") {
        filter.bookingReference = id.toUpperCase();
      } else if (email && typeof email === "string") {
        filter.patientEmail = email.toLowerCase();
      } else if (doctorId && typeof doctorId === "string") {
        filter.doctorSlug = doctorId;
      } else if (req.user) {
        if (String(req.user.role).toLowerCase() === "patient") {
          filter.patientEmail = req.user.email.toLowerCase();
        } else if (String(req.user.role).toLowerCase() === "doctor") {
          filter.$or = [
            { doctorId: req.user.userId },
            { doctorSlug: req.user.email.split("@")[0] },
          ];
        }
      }

      const appointments = await Appointment.find(filter).sort({ appointmentDate: -1 }).lean();
      res.json({ success: true, count: appointments.length, appointments });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error fetching appointments";
      res.status(500).json({ success: false, error: msg });
    }
  },

  book: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const parsed = appointmentBookingSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, error: parsed.error.issues[0]?.message || "Invalid appointment data" });
        return;
      }

      const {
        patientName,
        patientEmail,
        patientPhone,
        specialtyId,
        specialtyName,
        doctorId,
        doctorName,
        date,
        timeSlot,
      } = parsed.data;
      const reason = (req.body as any).reason || (parsed.data as any).notes || "";
      const consultationType = (req.body as any).consultationType || "IN_PERSON";

      const docSlug = doctorId || "first-available";

      // Collision check
      if (docSlug !== "first-available") {
        const conflict = await Appointment.findOne({
          doctorSlug: docSlug,
          appointmentDate: date,
          appointmentTime: timeSlot,
          status: { $ne: "CANCELLED" },
        });

        if (conflict) {
          res.status(409).json({ success: false, error: `The ${timeSlot} slot on ${date} is already booked.` });
          return;
        }
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const bookingReference = `MBG-${new Date().getFullYear()}-${randomSuffix}`;
      const user = await User.findOne({ email: patientEmail.toLowerCase() });

      const newApt = await Appointment.create({
        bookingReference,
        patientId: user?._id || (req.user ? req.user.userId : undefined),
        patientName,
        patientEmail: patientEmail.toLowerCase(),
        patientPhone,
        specialtyId,
        specialtyName,
        doctorSlug: docSlug,
        doctorName: doctorName || "First Available Specialist",
        appointmentDate: date,
        appointmentTime: timeSlot,
        consultationType: consultationType as any,
        status: "CONFIRMED",
        reason: reason || "General Consultation",
      });

      res.status(201).json({
        success: true,
        message: "Appointment confirmed",
        appointment: newApt,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Booking error";
      res.status(500).json({ success: false, error: msg });
    }
  },

  cancel: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = req.params.id || req.body.id || req.body.bookingReference;
      const { cancellationReason } = req.body;

      if (!id) {
        res.status(400).json({ success: false, error: "Appointment ID or reference required" });
        return;
      }

      const updated = await Appointment.findOneAndUpdate(
        { $or: [{ bookingReference: String(id).toUpperCase() }, { _id: id }] },
        {
          $set: {
            status: "CANCELLED",
            cancellationReason: cancellationReason || "Cancelled by user",
          },
        },
        { new: true }
      );

      if (!updated) {
        res.status(404).json({ success: false, error: "Appointment not found" });
        return;
      }

      res.json({
        success: true,
        message: "Appointment cancelled successfully",
        appointment: updated,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cancellation error";
      res.status(500).json({ success: false, error: msg });
    }
  },
};

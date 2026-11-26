import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { User, PatientProfile, Appointment, MedicalRecord } from "../models";

function mapAppointment(doc: any) {
  return {
    id: doc.bookingReference,
    bookingReference: doc.bookingReference,
    _id: doc._id?.toString(),
    doctorSlug: doc.doctorSlug,
    doctorName: doc.doctorName || "First Available Specialist",
    specialtyId: doc.specialtyId,
    specialtyName: doc.specialtyName,
    patientName: doc.patientName,
    date: doc.appointmentDate,
    appointmentDate: doc.appointmentDate,
    timeSlot: doc.appointmentTime,
    appointmentTime: doc.appointmentTime,
    status: (doc.status || "CONFIRMED").toLowerCase(),
    type: doc.consultationType === "VIRTUAL" ? "Virtual Consultation" : "In-Person Consultation",
    consultationType: doc.consultationType || "IN_PERSON",
    reason: doc.reason || "General Consultation",
  };
}

export const patientController = {
  getProfile: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const cleanEmail = req.user.email.toLowerCase();

      const [userDoc, profileDoc, appointments, medicalRecords] = await Promise.all([
        User.findById(req.user.userId),
        PatientProfile.findOne({ userId: req.user.userId }),
        Appointment.find({
          $or: [{ patientId: req.user.userId }, { patientEmail: cleanEmail }],
        }).sort({ appointmentDate: -1 }),
        MedicalRecord.find({ patientId: req.user.userId }).sort({ createdAt: -1 }),
      ]);

      if (!userDoc) {
        res.status(404).json({ success: false, error: "Patient not found" });
        return;
      }

      const todayStr = new Date().toISOString().split("T")[0];
      const upcomingVisits = appointments.filter(
        (a) => a.appointmentDate >= todayStr && a.status !== "CANCELLED"
      );
      const uniqueDoctors = new Set(appointments.map((a) => a.doctorName || a.doctorSlug)).size;

      const profile = {
        id: userDoc._id.toString(),
        fullName: userDoc.fullName,
        email: userDoc.email,
        phone: userDoc.phone,
        role: "patient",
        dateOfBirth: profileDoc?.dateOfBirth,
        gender: profileDoc?.gender,
        address: profileDoc?.address,
        emergencyContact: profileDoc?.emergencyContact,
        bloodGroup: profileDoc?.bloodGroup,
        allergies: profileDoc?.allergies || [],
        medicalHistory: (profileDoc as any)?.medicalHistory || "",
        createdAt: userDoc.createdAt,
      };

      const mappedAppointments = appointments.map(mapAppointment);

      res.json({
        success: true,
        profile,
        metrics: {
          upcomingVisitsCount: upcomingVisits.length,
          diagnosticReportsCount: medicalRecords.length,
          careSpecialistsCount: uniqueDoctors,
          followUpStage: upcomingVisits.length > 0 ? "Stage 02" : "Stage 01",
        },
        upcomingVisitsCount: upcomingVisits.length,
        diagnosticReportsCount: medicalRecords.length,
        careSpecialistsCount: uniqueDoctors,
        followUpStage: upcomingVisits.length > 0 ? "Stage 02" : "Stage 01",
        nextAppointment: upcomingVisits[0] ? mapAppointment(upcomingVisits[0]) : null,
        upcomingAppointments: mappedAppointments,
        appointments: mappedAppointments,
        medicalRecords: medicalRecords.map((r: any) => ({
          id: r._id.toString(),
          title: r.title,
          doctorName: r.doctorName,
          date: r.date,
          status: r.status,
          summary: r.summary,
        })),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrieving patient profile";
      res.status(500).json({ success: false, error: msg });
    }
  },

  updateProfile: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const { fullName, phone, ...allowedProfileFields } = req.body;

      if (fullName || phone) {
        await User.findByIdAndUpdate(req.user.userId, {
          ...(fullName ? { fullName } : {}),
          ...(phone ? { phone } : {}),
        });
      }

      const updatedProfile = await PatientProfile.findOneAndUpdate(
        { userId: req.user.userId },
        { $set: allowedProfileFields },
        { new: true, upsert: true }
      );

      res.json({
        success: true,
        message: "Profile updated successfully",
        profile: updatedProfile,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating patient profile";
      res.status(500).json({ success: false, error: msg });
    }
  },
};

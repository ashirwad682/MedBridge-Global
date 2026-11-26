import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { User, DoctorProfile, Appointment } from "../models";

export const doctorProfileController = {
  getProfile: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const [userDoc, profileDoc] = await Promise.all([
        User.findById(req.user.userId),
        DoctorProfile.findOne({
          $or: [
            { userId: req.user.userId },
            { doctorId: req.user.email.split("@")[0] },
          ],
        }),
      ]);

      if (!userDoc || !profileDoc) {
        res.status(404).json({ success: false, error: "Doctor profile not found" });
        return;
      }

      const appointments = await Appointment.find({
        $or: [
          { doctorId: req.user.userId },
          { doctorSlug: profileDoc.doctorId },
        ],
      }).sort({ appointmentDate: 1, appointmentTime: 1 }).lean();

      const todayStr = new Date().toISOString().split("T")[0];
      const todayAppointments = appointments.filter(
        (a) => a.appointmentDate === todayStr || a.appointmentDate >= todayStr
      );
      const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
      const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;

      const profile = {
        id: userDoc._id.toString(),
        doctorId: profileDoc.doctorId,
        fullName: userDoc.fullName,
        name: profileDoc.name || userDoc.fullName,
        email: userDoc.email,
        phone: userDoc.phone,
        role: "doctor",
        specialization: profileDoc.specialization || profileDoc.specialtyName,
        specialtyId: profileDoc.specialtyId,
        specialtyName: profileDoc.specialtyName,
        medicalRegistrationNumber: profileDoc.medicalRegistrationNumber,
        verificationStatus: profileDoc.verificationStatus,
        qualifications: profileDoc.qualifications,
        yearsOfExperience: profileDoc.yearsOfExperience,
        hospitalOrClinic: profileDoc.hospitalOrClinic || profileDoc.hospitalAffiliation,
        consultationFee: profileDoc.consultationFee,
        rating: profileDoc.rating || 4.95,
        reviewCount: profileDoc.reviewCount || 120,
        bio: profileDoc.bio,
        profileImage: profileDoc.profileImage || profileDoc.image,
        isAcceptingNewPatients: profileDoc.isAcceptingNewPatients ?? true,
        isAcceptingPatients: profileDoc.isAcceptingNewPatients ?? true,
        availableDays: profileDoc.availableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableHours: profileDoc.availableHours || "09:00 AM - 05:00 PM",
        createdAt: userDoc.createdAt,
      };

      const mappedQueue = todayAppointments.map((a: any) => ({
        id: a.bookingReference,
        bookingReference: a.bookingReference,
        patientName: a.patientName,
        patientEmail: a.patientEmail,
        patientPhone: a.patientPhone,
        timeSlot: a.appointmentTime,
        type: a.consultationType === "VIRTUAL" ? "Virtual Consultation" : "In-Person Consultation",
        chiefComplaint: a.reason || "General Consultation",
        status: a.status === "CONFIRMED" ? "Confirmed" : a.status === "COMPLETED" ? "Completed" : "Checked In",
        appointmentDate: a.appointmentDate,
      }));

      res.json({
        success: true,
        profile,
        stats: {
          todayAppointmentsCount: todayAppointments.length,
          completedConsultationsCount: completedCount,
          pendingReviewsCount: confirmedCount,
          rating: profileDoc.rating || 4.95,
        },
        metrics: {
          todayPatientsCount: todayAppointments.length,
          totalConsultationsCount: appointments.length,
          confirmedCount,
          completedCount,
          rating: profileDoc.rating || 4.95,
        },
        todayQueue: mappedQueue,
        queue: mappedQueue,
        appointments: appointments.map((a: any) => ({
          id: a.bookingReference,
          bookingReference: a.bookingReference,
          patientName: a.patientName,
          patientEmail: a.patientEmail,
          patientPhone: a.patientPhone,
          timeSlot: a.appointmentTime,
          date: a.appointmentDate,
          appointmentDate: a.appointmentDate,
          status: (a.status || "CONFIRMED").toLowerCase(),
          reason: a.reason,
        })),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrieving doctor profile";
      res.status(500).json({ success: false, error: msg });
    }
  },

  updateProfile: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const body = req.body;

      // 1. Check if updating appointment status in queue
      const appointmentId = body.appointmentId;
      const newStatus = body.newStatus || body.status;
      if (appointmentId && newStatus) {
        const statusUpper = String(newStatus).toUpperCase().replace(/\s+/g, "_");
        const updatedApt = await Appointment.findOneAndUpdate(
          { bookingReference: String(appointmentId).toUpperCase() },
          { $set: { status: statusUpper } },
          { new: true }
        );
        res.json({
          success: true,
          message: `Appointment ${appointmentId} status updated to ${newStatus}.`,
          appointment: updatedApt,
        });
        return;
      }

      // 2. Check if toggling doctor availability
      const accepting =
        typeof body.isAcceptingNewPatients === "boolean"
          ? body.isAcceptingNewPatients
          : typeof body.isAcceptingPatients === "boolean"
            ? body.isAcceptingPatients
            : undefined;

      if (accepting !== undefined) {
        const updatedProfile = await DoctorProfile.findOneAndUpdate(
          { $or: [{ userId: req.user.userId }, { doctorId: req.user.email.split("@")[0] }] },
          { $set: { isAcceptingNewPatients: accepting } },
          { new: true }
        );
        res.json({
          success: true,
          message: `Clinic availability updated to ${accepting ? "Accepting Patients" : "Full Capacity"}.`,
          profile: updatedProfile,
        });
        return;
      }

      // 3. Update user contact info & profile fields
      const { fullName, phone, ...allowedFields } = body;
      if (fullName || phone) {
        await User.findByIdAndUpdate(req.user.userId, {
          ...(fullName ? { fullName } : {}),
          ...(phone ? { phone } : {}),
        });
      }

      const updatedProfile = await DoctorProfile.findOneAndUpdate(
        { $or: [{ userId: req.user.userId }, { doctorId: req.user.email.split("@")[0] }] },
        { $set: allowedFields },
        { new: true }
      );

      res.json({
        success: true,
        message: "Doctor profile updated successfully.",
        profile: updatedProfile,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating doctor profile";
      res.status(500).json({ success: false, error: msg });
    }
  },

  getVerificationStatus: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: "Authentication required" });
        return;
      }

      const profile = await DoctorProfile.findOne({
        $or: [{ userId: req.user.userId }, { doctorId: req.user.email.split("@")[0] }],
      });

      if (!profile) {
        res.status(404).json({ success: false, error: "Doctor profile not found" });
        return;
      }

      res.json({
        success: true,
        verificationStatus: profile.verificationStatus,
        medicalRegistrationNumber: profile.medicalRegistrationNumber,
        specialization: profile.specialization,
        isVerified: profile.verificationStatus === "VERIFIED",
        verifiedAt: profile.verifiedAt,
        rejectionReason: profile.rejectionReason,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error retrieving verification status";
      res.status(500).json({ success: false, error: msg });
    }
  },
};

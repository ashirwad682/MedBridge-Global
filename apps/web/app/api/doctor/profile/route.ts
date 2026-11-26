import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest, isAuthorizedResponse } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, DoctorProfile, Appointment } from "@/lib/models";
import { doctorProfileUpdateSchema } from "@/lib/auth/validation";

export async function GET() {
  const auth = await authorizeRequest("doctor");
  if (!isAuthorizedResponse(auth)) return auth;

  try {
    await connectToDatabase();
    const [userDoc, profileDoc] = await Promise.all([
      User.findById(auth.user.id),
      DoctorProfile.findOne({
        $or: [
          { userId: auth.user.id },
          { doctorId: auth.user.email.split("@")[0] },
        ],
      }),
    ]);

    if (!userDoc || !profileDoc) {
      return NextResponse.json({ success: false, error: "Doctor profile not found" }, { status: 404 });
    }

    // Fetch doctor's real appointments from MongoDB
    const appointments = await Appointment.find({
      $or: [
        { doctorId: auth.user.id },
        { doctorSlug: profileDoc.doctorId },
      ],
    }).sort({ appointmentDate: 1, appointmentTime: 1 }).lean();

    const todayStr = new Date().toISOString().split("T")[0];
    const todayAppointments = appointments.filter((a) => a.appointmentDate === todayStr || a.appointmentDate >= todayStr);
    const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
    const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;

    return NextResponse.json({
      success: true,
      profile: {
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
      },
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
      todayQueue: todayAppointments.map((a: any) => ({
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
      })),
      queue: todayAppointments.map((a: any) => ({
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
      })),
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
  } catch (error) {
    console.error("[Doctor Profile GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve doctor profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await authorizeRequest("doctor");
  if (!isAuthorizedResponse(auth)) return auth;

  try {
    const body = await req.json();
    await connectToDatabase();

    // Check if toggling status of an appointment in doctor's queue
    const appointmentId = body.appointmentId;
    const newStatus = body.newStatus || body.status;
    if (appointmentId && newStatus) {
      const statusUpper = String(newStatus).toUpperCase().replace(/\s+/g, "_");
      const updatedApt = await Appointment.findOneAndUpdate(
        { bookingReference: String(appointmentId).toUpperCase() },
        { $set: { status: statusUpper } },
        { new: true }
      );
      return NextResponse.json({
        success: true,
        message: `Appointment ${appointmentId} status updated to ${newStatus}.`,
        appointment: updatedApt,
      });
    }

    // Check if toggling doctor availability
    const accepting =
      typeof body.isAcceptingNewPatients === "boolean"
        ? body.isAcceptingNewPatients
        : typeof body.isAcceptingPatients === "boolean"
          ? body.isAcceptingPatients
          : undefined;

    if (accepting !== undefined) {
      const updatedProfile = await DoctorProfile.findOneAndUpdate(
        { $or: [{ userId: auth.user.id }, { doctorId: auth.user.email.split("@")[0] }] },
        { $set: { isAcceptingNewPatients: accepting } },
        { new: true }
      );
      return NextResponse.json({
        success: true,
        message: `Clinic availability updated to ${accepting ? "Accepting Patients" : "Full Capacity"}.`,
        profile: updatedProfile,
      });
    }

    const parseResult = doctorProfileUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      const msg = parseResult.error.issues[0]?.message || "Invalid doctor profile data";
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    const { fullName, phone, ...allowedFields } = parseResult.data;

    if (fullName || phone) {
      await User.findByIdAndUpdate(auth.user.id, {
        ...(fullName ? { fullName } : {}),
        ...(phone ? { phone } : {}),
      });
    }

    const updatedProfile = await DoctorProfile.findOneAndUpdate(
      { $or: [{ userId: auth.user.id }, { doctorId: auth.user.email.split("@")[0] }] },
      { $set: allowedFields },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Doctor profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("[Doctor Profile PATCH] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update doctor profile." },
      { status: 500 }
    );
  }
}

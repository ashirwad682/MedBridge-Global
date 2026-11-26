import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest, isAuthorizedResponse } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, PatientProfile, Appointment, MedicalRecord } from "@/lib/models";
import { patientProfileUpdateSchema } from "@/lib/auth/validation";

export async function GET() {
  const auth = await authorizeRequest("patient");
  if (!isAuthorizedResponse(auth)) return auth;

  try {
    await connectToDatabase();
    const cleanEmail = auth.user.email.toLowerCase();

    const [userDoc, profileDoc, appointments, medicalRecords] = await Promise.all([
      User.findById(auth.user.id),
      PatientProfile.findOne({ userId: auth.user.id }),
      Appointment.find({
        $or: [
          { patientId: auth.user.id },
          { patientEmail: cleanEmail },
        ],
      }).sort({ appointmentDate: -1 }),
      MedicalRecord.find({ patientId: auth.user.id }).sort({ createdAt: -1 }),
    ]);

    if (!userDoc) {
      return NextResponse.json({ success: false, error: "Patient not found" }, { status: 404 });
    }

    // Compute live real-time metrics from MongoDB
    const todayStr = new Date().toISOString().split("T")[0];
    const upcomingVisits = appointments.filter(
      (a) => a.appointmentDate >= todayStr && a.status !== "CANCELLED"
    );
    const uniqueDoctors = new Set(appointments.map((a) => a.doctorName || a.doctorSlug)).size;

    return NextResponse.json({
      success: true,
      profile: {
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
      },
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
      upcomingAppointments: appointments.map(mapAppointment),
      appointments: appointments.map(mapAppointment),
      medicalRecords: medicalRecords.map((r: any) => ({
        id: r._id.toString(),
        title: r.title,
        recordType: r.recordType || r.category || "Consultation Note",
        doctorName: r.doctorName || "Dr. Sarah Thorne, MD",
        facility: r.facility || "MedBridge Diagnostic Network",
        status: r.status || "Verified",
        documentUrl: r.documentUrl || "",
        notes: r.notes || r.summary || "",
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error("[Patient Profile GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve patient profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await authorizeRequest("patient");
  if (!isAuthorizedResponse(auth)) return auth;

  try {
    const body = await req.json();
    const parseResult = patientProfileUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      const msg = parseResult.error.issues[0]?.message || "Invalid profile data";
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    const { fullName, phone, ...profileFields } = parseResult.data;
    await connectToDatabase();

    // 1. Update basic user details if provided
    if (fullName || phone) {
      await User.findByIdAndUpdate(auth.user.id, {
        ...(fullName ? { fullName } : {}),
        ...(phone ? { phone } : {}),
      });
    }

    // 2. Update patient profile document
    const updatedProfile = await PatientProfile.findOneAndUpdate(
      { userId: auth.user.id },
      { $set: profileFields },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Patient profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("[Patient Profile PATCH] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile." },
      { status: 500 }
    );
  }
}

function mapAppointment(doc: any) {
  return {
    id: doc.bookingReference,
    bookingReference: doc.bookingReference,
    _id: doc._id?.toString(),
    patientName: doc.patientName,
    patientEmail: doc.patientEmail,
    patientPhone: doc.patientPhone,
    specialtyId: doc.specialtyId,
    specialtyName: doc.specialtyName,
    doctorSlug: doc.doctorSlug,
    doctorName: doc.doctorName || "Clinical Specialist",
    date: doc.appointmentDate,
    appointmentDate: doc.appointmentDate,
    timeSlot: doc.appointmentTime,
    appointmentTime: doc.appointmentTime,
    consultationType: doc.consultationType || "IN_PERSON",
    status: (doc.status || "CONFIRMED").toLowerCase(),
    reason: doc.reason || "General Consultation",
    notes: doc.notes || "",
    createdAt: doc.createdAt,
  };
}

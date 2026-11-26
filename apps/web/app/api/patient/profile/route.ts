import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest, isAuthorizedResponse } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User, PatientProfile, Appointment } from "@/lib/models";
import { patientProfileUpdateSchema } from "@/lib/auth/validation";

export async function GET() {
  const auth = await authorizeRequest("patient");
  if (!isAuthorizedResponse(auth)) return auth;

  try {
    await connectToDatabase();
    const [userDoc, profileDoc, appointments] = await Promise.all([
      User.findById(auth.user.id),
      PatientProfile.findOne({ userId: auth.user.id }),
      Appointment.find({ patientId: auth.user.id }).sort({ appointmentDate: -1 }).limit(10),
    ]);

    if (!userDoc) {
      return NextResponse.json({ success: false, error: "Patient not found" }, { status: 404 });
    }

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
        appointments: appointments || [],
        createdAt: userDoc.createdAt,
      },
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

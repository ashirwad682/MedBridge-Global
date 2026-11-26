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
    const [userDoc, profileDoc, appointments] = await Promise.all([
      User.findById(auth.user.id),
      DoctorProfile.findOne({ userId: auth.user.id }),
      Appointment.find({ doctorId: auth.user.id }).sort({ appointmentDate: 1 }).limit(10),
    ]);

    if (!userDoc || !profileDoc) {
      return NextResponse.json({ success: false, error: "Doctor profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: userDoc._id.toString(),
        fullName: userDoc.fullName,
        email: userDoc.email,
        phone: userDoc.phone,
        role: "doctor",
        specialization: profileDoc.specialization,
        medicalRegistrationNumber: profileDoc.medicalRegistrationNumber,
        verificationStatus: profileDoc.verificationStatus,
        qualifications: profileDoc.qualifications,
        yearsOfExperience: profileDoc.yearsOfExperience,
        hospitalOrClinic: profileDoc.hospitalOrClinic,
        consultationFee: profileDoc.consultationFee,
        bio: profileDoc.bio,
        profileImage: profileDoc.profileImage,
        appointments: appointments || [],
        createdAt: userDoc.createdAt,
      },
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
    const parseResult = doctorProfileUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      const msg = parseResult.error.issues[0]?.message || "Invalid doctor profile data";
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    // STRICT: Never allow the user to modify verificationStatus, userId, or registrationNumber via update
    const { fullName, phone, ...allowedFields } = parseResult.data;
    await connectToDatabase();

    if (fullName || phone) {
      await User.findByIdAndUpdate(auth.user.id, {
        ...(fullName ? { fullName } : {}),
        ...(phone ? { phone } : {}),
      });
    }

    const updatedProfile = await DoctorProfile.findOneAndUpdate(
      { userId: auth.user.id },
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

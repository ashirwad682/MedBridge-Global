import { NextResponse } from "next/server";
import { authorizeRequest, isAuthorizedResponse } from "@/lib/auth/rbac";
import { connectToDatabase } from "@/lib/db/mongodb";
import { DoctorProfile } from "@/lib/models";

export async function GET() {
  const auth = await authorizeRequest("doctor");
  if (!isAuthorizedResponse(auth)) return auth;

  try {
    await connectToDatabase();
    const profile = await DoctorProfile.findOne({ userId: auth.user.id });

    if (!profile) {
      return NextResponse.json({ success: false, error: "Doctor profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      verificationStatus: profile.verificationStatus,
      medicalRegistrationNumber: profile.medicalRegistrationNumber,
      specialization: profile.specialization,
      isVerified: profile.verificationStatus === "VERIFIED",
      verifiedAt: profile.verifiedAt,
      rejectionReason: profile.rejectionReason,
    });
  } catch (error) {
    console.error("[Doctor Verification Status API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve verification status." },
      { status: 500 }
    );
  }
}


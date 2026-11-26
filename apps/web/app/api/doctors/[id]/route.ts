import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { DoctorProfile } from "@/lib/models/DoctorProfile";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const query: Record<string, any> = { doctorId: id };

    // Also allow MongoDB ObjectId lookup if requested
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or = [{ doctorId: id }, { _id: id }];
      delete query.doctorId;
    }

    const doc: any = await DoctorProfile.findOne(query).lean();

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Doctor not found." },
        { status: 404 }
      );
    }

    const doctor = {
      id: doc.doctorId,
      _id: doc._id.toString(),
      name: doc.name || doc.fullName,
      specialtyId: doc.specialtyId,
      specialtyName: doc.specialtyName,
      role: doc.roleTitle || doc.specialization,
      experience: doc.experience || `${doc.yearsOfExperience || 10} years`,
      rating: doc.rating || 4.9,
      reviewCount: doc.reviewCount || 100,
      image: doc.image || doc.profileImage || "/images/doctors/marcus-chen.png",
      education: doc.education || doc.qualifications?.[0] || "MD, Board Certified",
      hospitalAffiliation: doc.hospitalAffiliation || doc.hospitalOrClinic || "MedBridge Specialist Network",
      languages: doc.languages || ["English"],
      consultationFee: doc.consultationFee || "$200",
      bio: doc.bio || "",
      location: doc.location || "New York, NY",
      availableDays: doc.availableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      availableHours: doc.availableHours || "09:00 AM - 05:00 PM",
      isAcceptingNewPatients: doc.isAcceptingNewPatients ?? true,
      verificationStatus: doc.verificationStatus,
    };

    return NextResponse.json({
      success: true,
      doctor,
    });
  } catch (error: unknown) {
    console.error("[API Doctor GET] Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve doctor details." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const query: Record<string, any> = { doctorId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or = [{ doctorId: id }, { _id: id }];
      delete query.doctorId;
    }

    const updated = await DoctorProfile.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Doctor not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Doctor profile updated successfully.",
      doctor: updated,
    });
  } catch (error: unknown) {
    console.error("[API Doctor PATCH] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update doctor." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const query: Record<string, any> = { doctorId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or = [{ doctorId: id }, { _id: id }];
      delete query.doctorId;
    }

    const deleted = await DoctorProfile.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Doctor not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Doctor record removed successfully.",
    });
  } catch (error: unknown) {
    console.error("[API Doctor DELETE] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete doctor." },
      { status: 500 }
    );
  }
}

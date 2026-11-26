import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Specialty } from "@/lib/models/Specialty";
import { DoctorProfile } from "@/lib/models/DoctorProfile";

export async function GET(_request: NextRequest) {
  try {
    await connectToDatabase();

    const specialties = await Specialty.find().sort({ name: 1 }).lean();

    // Dynamically calculate doctor counts from DoctorProfile collection
    const counts = await DoctorProfile.aggregate([
      { $match: { verificationStatus: "VERIFIED" } },
      { $group: { _id: "$specialtyId", count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    counts.forEach((c: any) => {
      countMap[c._id] = c.count;
    });

    const enriched = specialties.map((s: any) => ({
      ...s,
      doctorCount: countMap[s.specialtyId] ?? s.doctorCount ?? 0,
    }));

    return NextResponse.json({
      success: true,
      count: enriched.length,
      specialties: enriched,
    });
  } catch (error: unknown) {
    console.error("[API Specialties GET] Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch specialties from database." },
      { status: 500 }
    );
  }
}

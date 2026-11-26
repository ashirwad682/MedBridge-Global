import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { DoctorProfile } from "@/lib/models/DoctorProfile";
import { Specialty } from "@/lib/models/Specialty";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const specialty = searchParams.get("specialty")?.trim();
    const search = searchParams.get("search")?.trim();
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const sort = searchParams.get("sort") || "rating"; // rating, experience, name

    // Build MongoDB query filter
    const filter: Record<string, any> = {
      verificationStatus: "VERIFIED",
    };

    if (specialty && specialty !== "all") {
      filter.specialtyId = specialty;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { fullName: searchRegex },
        { specialtyName: searchRegex },
        { hospitalAffiliation: searchRegex },
        { hospitalOrClinic: searchRegex },
        { bio: searchRegex },
        { location: searchRegex },
      ];
    }

    // Sort order
    let sortOption: Record<string, 1 | -1> = { rating: -1, reviewCount: -1 };
    if (sort === "experience") {
      sortOption = { yearsOfExperience: -1, rating: -1 };
    } else if (sort === "name") {
      sortOption = { name: 1 };
    }

    const doctors = await DoctorProfile.find(filter)
      .sort(sortOption)
      .limit(limit)
      .lean();

    // Map MongoDB docs to frontend-compatible Doctor objects
    const mappedDoctors = doctors.map((doc: any) => ({
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
    }));

    return NextResponse.json({
      success: true,
      count: mappedDoctors.length,
      doctors: mappedDoctors,
    });
  } catch (error: unknown) {
    console.error("[API Doctors GET] Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch doctors from database.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const {
      doctorId,
      name,
      specialtyId,
      specialtyName,
      roleTitle,
      education,
      experience,
      hospitalAffiliation,
      consultationFee,
      languages,
      bio,
      location,
      image,
    } = body;

    if (!doctorId || !name || !specialtyId || !specialtyName) {
      return NextResponse.json(
        { success: false, error: "doctorId, name, specialtyId, and specialtyName are required." },
        { status: 400 }
      );
    }

    const existing = await DoctorProfile.findOne({ doctorId });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A doctor with this ID already exists." },
        { status: 409 }
      );
    }

    const newDoctor = await DoctorProfile.create({
      doctorId,
      name,
      fullName: name,
      specialtyId,
      specialtyName,
      roleTitle: roleTitle || "Specialist Physician",
      education: education || "MD",
      experience: experience || "10 years",
      yearsOfExperience: parseInt(experience) || 10,
      hospitalAffiliation: hospitalAffiliation || "MedBridge Specialist Hospital",
      hospitalOrClinic: hospitalAffiliation || "MedBridge Specialist Hospital",
      consultationFee: consultationFee || "$200",
      languages: languages || ["English"],
      bio: bio || "",
      location: location || "New York, NY",
      image: image || "/images/doctors/marcus-chen.png",
      verificationStatus: "VERIFIED",
      isVerified: true,
      isAcceptingNewPatients: true,
    });

    return NextResponse.json({
      success: true,
      doctor: newDoctor,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("[API Doctors POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create doctor in database." },
      { status: 500 }
    );
  }
}

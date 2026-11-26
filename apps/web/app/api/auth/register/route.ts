import { NextRequest, NextResponse } from "next/server";
import { POST as patientRegister } from "./patient/route";
import { POST as doctorRegister } from "./doctor/route";

export async function POST(req: NextRequest) {
  try {
    const clonedReq = req.clone();
    const body = await clonedReq.json();
    const role = (body.role || "").toLowerCase();

    if (role === "doctor") {
      return doctorRegister(req);
    }

    return patientRegister(req);
  } catch (error) {
    console.error("[Unified Register API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid registration request payload" },
      { status: 400 }
    );
  }
}

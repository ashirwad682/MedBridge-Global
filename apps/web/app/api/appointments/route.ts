import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AppointmentRecord } from "@/lib/medical-data";

const dataFilePath = path.join(process.cwd(), "data", "appointments.json");

function readAppointments(): AppointmentRecord[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, "[]", "utf8");
      return [];
    }
    const raw = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading appointments:", err);
    return [];
  }
}

function writeAppointments(appointments: AppointmentRecord[]): void {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  fs.writeFileSync(dataFilePath, JSON.stringify(appointments, null, 2), "utf8");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email")?.trim().toLowerCase();
  const id = searchParams.get("id")?.trim().toUpperCase();
  const date = searchParams.get("date")?.trim();

  const all = readAppointments();

  // Public slot availability lookup for scheduling (returns only time slots, no PII)
  if (date) {
    const doctorId = searchParams.get("doctorId")?.trim();
    const booked = all
      .filter((apt) => {
        if (apt.date !== date || apt.status === "cancelled") return false;
        if (doctorId && doctorId !== "first-available" && apt.doctorId !== doctorId) return false;
        return true;
      })
      .map((apt) => apt.timeSlot);

    return NextResponse.json({ bookedSlots: booked });
  }

  // Privacy protection: only return records matching the requester's email or booking ID
  if (id) {
    const found = all.filter((apt) => apt.id.toUpperCase() === id);
    return NextResponse.json({ appointments: found });
  }

  if (email) {
    const found = all.filter((apt) => apt.patientEmail.toLowerCase() === email);
    return NextResponse.json({ appointments: found });
  }

  // If no email or ID query param, do not leak any records
  return NextResponse.json(
    { appointments: [], message: "Provide an email address or booking ID to retrieve records." },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientName,
      patientEmail,
      patientPhone,
      specialtyId,
      specialtyName,
      doctorId,
      doctorName,
      date,
      timeSlot,
      reason,
    } = body;

    // Validation
    if (!patientName || patientName.trim().length < 2) {
      return NextResponse.json({ error: "Patient name is required (at least 2 characters)." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patientEmail || !emailRegex.test(patientEmail.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const phoneRegex = /^[\d\s+\-()]{7,20}$/;
    if (!patientPhone || !phoneRegex.test(patientPhone.trim())) {
      return NextResponse.json({ error: "A valid phone number is required (at least 7 digits)." }, { status: 400 });
    }

    if (!specialtyId || !specialtyName) {
      return NextResponse.json({ error: "Medical specialty selection is required." }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: "Preferred appointment date is required." }, { status: 400 });
    }

    // Date validation: prevent past dates
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(appointmentDate.getTime()) || appointmentDate < today) {
      return NextResponse.json({ error: "Please select a valid upcoming date for your consultation." }, { status: 400 });
    }

    if (!timeSlot) {
      return NextResponse.json({ error: "Please select a preferred time slot." }, { status: 400 });
    }

    const consultationReason = reason && reason.trim().length > 0
      ? reason.trim()
      : "General specialist consultation and health assessment";

    const all = readAppointments();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const currentYear = new Date().getFullYear();
    const newId = `MBG-${currentYear}-${randomSuffix}`;

    const newAppointment: AppointmentRecord = {
      id: newId,
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim().toLowerCase(),
      patientPhone: patientPhone.trim(),
      specialtyId,
      specialtyName,
      doctorId: doctorId || "first-available",
      doctorName: doctorName || "First Available Specialist",
      date,
      timeSlot,
      reason: consultationReason,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    all.unshift(newAppointment);
    writeAppointments(all);

    return NextResponse.json({
      success: true,
      appointment: newAppointment,
      message: `Appointment scheduled successfully with reference ${newId}.`,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to schedule appointment. Please try again." },
      { status: 500 }
    );
  }
}


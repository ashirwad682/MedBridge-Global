import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Appointment } from "@/lib/models/Appointment";
import { User } from "@/lib/models/User";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email")?.trim().toLowerCase();
    const id = searchParams.get("id")?.trim().toUpperCase();
    const date = searchParams.get("date")?.trim();
    const doctorSlug = searchParams.get("doctorSlug")?.trim() || searchParams.get("doctorId")?.trim();
    const status = searchParams.get("status")?.trim();

    // 1. Public slot availability lookup for scheduling
    if (date) {
      const slotQuery: Record<string, any> = {
        appointmentDate: date,
        status: { $ne: "CANCELLED" },
      };

      if (doctorSlug && doctorSlug !== "first-available") {
        slotQuery.doctorSlug = doctorSlug;
      }

      const bookedDocs = await Appointment.find(slotQuery).select("appointmentTime").lean();
      const bookedSlots = bookedDocs.map((doc: any) => doc.appointmentTime);

      return NextResponse.json({ success: true, bookedSlots });
    }

    // 2. Lookup by unique booking reference ID (e.g. "MBG-2026-8812")
    if (id) {
      const found = await Appointment.find({ bookingReference: id }).lean();
      const mapped = found.map(mapAppointmentDocument);
      return NextResponse.json({ success: true, appointments: mapped });
    }

    // 3. Lookup by patient email
    if (email) {
      const found = await Appointment.find({ patientEmail: email }).sort({ appointmentDate: -1 }).lean();
      const mapped = found.map(mapAppointmentDocument);
      return NextResponse.json({ success: true, appointments: mapped });
    }

    // 4. Lookup by doctor slug/id
    if (doctorSlug && doctorSlug !== "first-available") {
      const docQuery: Record<string, any> = { doctorSlug };
      if (status) docQuery.status = status;

      const found = await Appointment.find(docQuery).sort({ appointmentDate: 1, appointmentTime: 1 }).lean();
      const mapped = found.map(mapAppointmentDocument);
      return NextResponse.json({ success: true, appointments: mapped });
    }

    // 5. Authenticated session lookup: return appointments matching the logged-in user
    const sessionUser = await getCurrentUser();
    if (sessionUser) {
      if (sessionUser.role.toLowerCase() === "doctor") {
        // Find doctor's appointments
        const found = await Appointment.find({
          $or: [
            { doctorId: sessionUser.id },
            { doctorSlug: sessionUser.email.split("@")[0] },
          ],
        }).sort({ appointmentDate: 1 }).lean();
        return NextResponse.json({ success: true, appointments: found.map(mapAppointmentDocument) });
      } else {
        // Patient's appointments
        const found = await Appointment.find({
          $or: [
            { patientId: sessionUser.id },
            { patientEmail: sessionUser.email.toLowerCase() },
          ],
        }).sort({ appointmentDate: -1 }).lean();
        return NextResponse.json({ success: true, appointments: found.map(mapAppointmentDocument) });
      }
    }

    // If no query parameters and not authenticated, return empty list
    return NextResponse.json(
      { success: true, appointments: [], message: "Provide an email address or reference ID to retrieve records." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[API Appointments GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointments from database." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
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
      consultationType = "IN_PERSON",
    } = body;

    // Strict validation
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

    // Prevent past dates
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(appointmentDate.getTime()) || appointmentDate < today) {
      return NextResponse.json({ error: "Please select a valid upcoming date for your consultation." }, { status: 400 });
    }

    if (!timeSlot) {
      return NextResponse.json({ error: "Please select a preferred time slot." }, { status: 400 });
    }

    const docSlug = doctorId || "first-available";

    // Double-booking prevention: Check if time slot is already booked for this doctor
    if (docSlug !== "first-available") {
      const existingConflict = await Appointment.findOne({
        doctorSlug: docSlug,
        appointmentDate: date,
        appointmentTime: timeSlot,
        status: { $ne: "CANCELLED" },
      });

      if (existingConflict) {
        return NextResponse.json(
          { error: `The ${timeSlot} slot on ${date} is already booked. Please select another available time.` },
          { status: 409 }
        );
      }
    }

    // Link user account if patient exists in database
    const cleanEmail = patientEmail.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });

    // Generate unique clinical reference ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const currentYear = new Date().getFullYear();
    const bookingReference = `MBG-${currentYear}-${randomSuffix}`;

    const consultationReason = reason && reason.trim().length > 0
      ? reason.trim()
      : "General specialist consultation and health assessment";

    const newAppointment = await Appointment.create({
      bookingReference,
      patientId: existingUser?._id,
      patientName: patientName.trim(),
      patientEmail: cleanEmail,
      patientPhone: patientPhone.trim(),
      specialtyId,
      specialtyName,
      doctorSlug: docSlug,
      doctorName: doctorName || "First Available Specialist",
      appointmentDate: date,
      appointmentTime: timeSlot,
      consultationType: consultationType === "VIRTUAL" ? "VIRTUAL" : "IN_PERSON",
      status: "CONFIRMED",
      reason: consultationReason,
    });

    return NextResponse.json({
      success: true,
      appointment: mapAppointmentDocument(newAppointment.toObject()),
      message: `Appointment scheduled successfully with reference ${bookingReference}.`,
    });
  } catch (error: unknown) {
    console.error("[API Appointments POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to schedule appointment in database. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, bookingReference, status, date, timeSlot, cancellationReason } = body;

    const ref = bookingReference || id;
    if (!ref) {
      return NextResponse.json({ error: "Booking reference is required for update." }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};

    if (status) {
      updateFields.status = status;
    }

    if (cancellationReason) {
      updateFields.cancellationReason = cancellationReason;
      updateFields.status = "CANCELLED";
    }

    if (date) {
      updateFields.appointmentDate = date;
    }

    if (timeSlot) {
      updateFields.appointmentTime = timeSlot;
    }

    const updated = await Appointment.findOneAndUpdate(
      { bookingReference: ref.toUpperCase() },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      appointment: mapAppointmentDocument(updated.toObject()),
      message: `Appointment ${ref} updated successfully.`,
    });
  } catch (error: unknown) {
    console.error("[API Appointments PATCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment in database." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id")?.trim().toUpperCase();

    if (!id) {
      return NextResponse.json({ error: "Appointment ID is required." }, { status: 400 });
    }

    const updated = await Appointment.findOneAndUpdate(
      { bookingReference: id },
      { $set: { status: "CANCELLED", cancellationReason: "Cancelled by user" } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Appointment ${id} has been cancelled.`,
    });
  } catch (error: unknown) {
    console.error("[API Appointments DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to cancel appointment." },
      { status: 500 }
    );
  }
}

function mapAppointmentDocument(doc: any) {
  return {
    id: doc.bookingReference,
    bookingReference: doc.bookingReference,
    _id: doc._id?.toString(),
    patientId: doc.patientId?.toString(),
    patientName: doc.patientName,
    patientEmail: doc.patientEmail,
    patientPhone: doc.patientPhone,
    specialtyId: doc.specialtyId,
    specialtyName: doc.specialtyName,
    doctorId: doc.doctorSlug || doc.doctorId?.toString() || "first-available",
    doctorSlug: doc.doctorSlug,
    doctorName: doc.doctorName || "First Available Specialist",
    date: doc.appointmentDate,
    appointmentDate: doc.appointmentDate,
    timeSlot: doc.appointmentTime,
    appointmentTime: doc.appointmentTime,
    consultationType: doc.consultationType || "IN_PERSON",
    status: (doc.status || "CONFIRMED").toLowerCase(),
    reason: doc.reason || "General consultation",
    notes: doc.notes || "",
    cancellationReason: doc.cancellationReason || "",
    createdAt: doc.createdAt?.toISOString?.() || doc.createdAt,
  };
}

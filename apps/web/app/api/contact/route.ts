import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { logAuditEvent } from "@/lib/auth/audit";
import { ContactInquiry } from "@/lib/models/ContactInquiry";
import { connectToDatabase } from "@/lib/db/mongodb";

function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;
    const ticketId = searchParams.get("ticketId")?.trim().toUpperCase();
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (ticketId) {
      const found = await ContactInquiry.findOne({ ticketId }).lean();
      if (!found) {
        return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
      }
      return NextResponse.json({
        ticket: {
          ticketId: found.ticketId,
          department: found.department,
          subject: found.subject,
          status: found.status,
          createdAt: found.createdAt,
        },
      });
    }

    if (email) {
      const list = await ContactInquiry.find({ email })
        .sort({ createdAt: -1 })
        .lean();

      const sanitized = list.map((c: any) => ({
        ticketId: c.ticketId,
        department: c.department,
        subject: c.subject,
        status: c.status,
        createdAt: c.createdAt,
      }));

      return NextResponse.json({ inquiries: sanitized });
    }

    return NextResponse.json(
      { message: "Provide a ticketId or email to lookup inquiry status." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[API Contact GET] Database error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve inquiry from database." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Rate Limiting: 5 submissions per minute per IP
  const rateCheck = checkRateLimit(`contact:${ip}`, 5, 60000);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        error: `Too many submissions. Please wait ${rateCheck.retryAfterSeconds} seconds before sending another message.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      department = "general",
      urgency = "routine",
      preferredContactMethod = "email",
      subject,
      message,
    } = body;

    // Strict validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Full Name is required (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email format." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return NextResponse.json(
        { error: "Subject is required (at least 3 characters)." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message is required (at least 10 characters)." },
        { status: 400 }
      );
    }

    const validDepartments = [
      "general",
      "scheduling",
      "specialist",
      "records",
      "billing",
      "partnerships",
    ];
    const dept = validDepartments.includes(department) ? department : "general";

    const validUrgencies = ["routine", "urgent", "emergency_advisory"];
    const urg = validUrgencies.includes(urgency) ? urgency : "routine";

    const validMethods = ["email", "phone", "sms"];
    const method = validMethods.includes(preferredContactMethod)
      ? preferredContactMethod
      : "email";

    // Clean inputs
    const cleanName = sanitizeText(name);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? sanitizeText(phone) : undefined;
    const cleanSubject = sanitizeText(subject);
    const cleanMessage = sanitizeText(message);

    // Generate unique clinical reference ticket ID
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const ticketId = `MBG-CNT-${new Date().getFullYear()}-${randomHex}`;

    // Pure MongoDB persistence
    await connectToDatabase();
    const inquiry = await ContactInquiry.create({
      ticketId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      department: dept,
      urgency: urg,
      preferredContactMethod: method,
      subject: cleanSubject,
      message: cleanMessage,
      status: "NEW",
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    await logAuditEvent({
      action: "CONTACT_FORM_SUBMISSION",
      resource: "ContactInquiry",
      status: "SUCCESS",
      details: `Inquiry ticket ${ticketId} created for ${cleanEmail} (Department: ${dept})`,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out. Your inquiry has been securely routed to our care team.",
        ticketId,
        inquiry: {
          ticketId: inquiry.ticketId,
          name: inquiry.name,
          email: inquiry.email,
          department: inquiry.department,
          subject: inquiry.subject,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[API Contact POST] Database Error:", error);
    return NextResponse.json(
      { error: "We were unable to process your message at this time. Please try again or call our support line." },
      { status: 500 }
    );
  }
}

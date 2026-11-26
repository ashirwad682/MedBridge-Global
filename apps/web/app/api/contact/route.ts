import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { logAuditEvent } from "@/lib/auth/audit";
import { ContactInquiry } from "@/lib/models/ContactInquiry";
import { connectToDatabase } from "@/lib/db/mongodb";

const dataFilePath = path.join(process.cwd(), "data", "contacts.json");

export interface ContactRecord {
  ticketId: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  urgency: "routine" | "urgent" | "emergency_advisory";
  preferredContactMethod: "email" | "phone" | "sms";
  subject: string;
  message: string;
  status: "NEW" | "IN_REVIEW" | "RESPONDED" | "RESOLVED";
  createdAt: string;
  ipAddress?: string;
}

function readContacts(): ContactRecord[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, "[]", "utf8");
      return [];
    }
    const raw = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[Contact API] Error reading contacts.json:", err);
    return [];
  }
}

function writeContacts(contacts: ContactRecord[]): void {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  fs.writeFileSync(dataFilePath, JSON.stringify(contacts, null, 2), "utf8");
}

function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, "") // basic tag stripping to sanitize
    .trim();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticketId = searchParams.get("ticketId")?.trim().toUpperCase();
  const email = searchParams.get("email")?.trim().toLowerCase();

  const all = readContacts();

  if (ticketId) {
    const found = all.find((c) => c.ticketId.toUpperCase() === ticketId);
    if (!found) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    // Return sanitized status info
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
    const list = all
      .filter((c) => c.email.toLowerCase() === email)
      .map((c) => ({
        ticketId: c.ticketId,
        department: c.department,
        subject: c.subject,
        status: c.status,
        createdAt: c.createdAt,
      }));
    return NextResponse.json({ inquiries: list });
  }

  return NextResponse.json(
    { message: "Provide a ticketId or email to lookup inquiry status." },
    { status: 200 }
  );
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

    const newRecord: ContactRecord = {
      ticketId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      department: dept,
      urgency: urg as any,
      preferredContactMethod: method as any,
      subject: cleanSubject,
      message: cleanMessage,
      status: "NEW",
      createdAt: new Date().toISOString(),
      ipAddress: ip,
    };

    // 1. File persistence (guarantees local & fallback storage)
    const all = readContacts();
    all.unshift(newRecord);
    writeContacts(all);

    // 2. MongoDB persistence (if connected)
    try {
      await connectToDatabase();
      await ContactInquiry.create({
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
    } catch (dbErr) {
      // Non-blocking fallback: logged for observability
      console.warn("[Contact API] MongoDB save bypassed or unavailable:", (dbErr as Error).message);
    }

    // 3. Security Audit Logging
    await logAuditEvent({
      action: "CONTACT_INQUIRY_SUBMITTED",
      resource: "Contact",
      status: "SUCCESS",
      details: `Ticket ${ticketId} created by ${cleanEmail} for department: ${dept}`,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        ticketId,
        message:
          "Your inquiry has been securely received by the MedBridge Global clinical coordination desk.",
        createdAt: newRecord.createdAt,
        expectedResponseTime:
          urg === "urgent"
            ? "Within 2 hours"
            : "Within 1 business day",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Contact API] Error processing inquiry:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while transmitting your inquiry. Please try again." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { SPECIALTIES_DATA, DOCTORS_DATA } from "@/lib/medical-data";

export interface ChatMessageData {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  actions?: Array<{
    label: string;
    type: "link" | "booking" | "suggestion";
    href?: string;
    specialtyId?: string;
  }>;
  isEmergencyAlert?: boolean;
}

// Emergency keywords check
const EMERGENCY_KEYWORDS = [
  "chest pain",
  "heart attack",
  "can't breathe",
  "cannot breathe",
  "shortness of breath",
  "difficulty breathing",
  "stroke",
  "numbness in face",
  "slurred speech",
  "unconscious",
  "fainted",
  "severe bleeding",
  "coughing blood",
  "suicide",
  "kill myself",
  "overdose",
  "poison",
  "anaphylaxis",
  "choking",
  "severe trauma",
];

// Medication prescription keywords check
const PRESCRIPTION_KEYWORDS = [
  "prescribe",
  "give me medicine",
  "what dosage",
  "how many mg",
  "antibiotic dose",
  "painkiller dosage",
  "can you write a prescription",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message content is required." },
        { status: 400 }
      );
    }

    const cleanMsg = message.trim().toLowerCase();

    // 1. EMERGENCY TRIAGE CHECK
    const isEmergency = EMERGENCY_KEYWORDS.some((kw) => cleanMsg.includes(kw));
    if (isEmergency) {
      return NextResponse.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `⚠️ **URGENT MEDICAL NOTICE**\n\nIf you or someone nearby is experiencing acute chest pain, severe shortness of breath, signs of stroke (facial drooping, arm weakness, slurred speech), heavy bleeding, or any life-threatening symptoms, please **call emergency services immediately**:\n\n• **911** (North America)\n• **112** (Europe / International)\n• **102 / 112** (India)\n\nAlternatively, please proceed immediately to the nearest hospital emergency room. MedBridge AI Assistant is an informational platform and cannot provide emergency trauma resuscitation or acute care.`,
          timestamp: new Date().toISOString(),
          isEmergencyAlert: true,
          actions: [
            {
              label: "Emergency Hotline Guide",
              type: "link",
              href: "/#contact",
            },
          ],
        } as ChatMessageData,
      });
    }

    // 2. PRESCRIPTION / DOSAGE SAFETY CHECK
    const isPrescriptionQuery = PRESCRIPTION_KEYWORDS.some((kw) =>
      cleanMsg.includes(kw)
    );
    if (isPrescriptionQuery) {
      return NextResponse.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `MedBridge AI cannot prescribe medications or recommend specific drug dosages.\n\nPrescribing medicine requires a comprehensive physical exam, full medical history, and allergy verification by a licensed physician.\n\nWould you like to schedule a consultation with one of our board-certified physicians who can safely evaluate your symptoms and prescribe appropriate therapies?`,
          timestamp: new Date().toISOString(),
          actions: [
            {
              label: "Schedule Doctor Consultation",
              type: "booking",
            },
            {
              label: "Browse Physicians",
              type: "link",
              href: "/doctors",
            },
          ],
        } as ChatMessageData,
      });
    }

    // 3. APPOINTMENT BOOKING INTENT
    if (
      cleanMsg.includes("book") ||
      cleanMsg.includes("appointment") ||
      cleanMsg.includes("schedule") ||
      cleanMsg.includes("consultation")
    ) {
      // Check if user specifically mentioned a specialty
      let matchedSpecId: string | undefined = undefined;
      for (const [id, spec] of Object.entries(SPECIALTIES_DATA)) {
        if (cleanMsg.includes(spec.name.toLowerCase()) || cleanMsg.includes(id)) {
          matchedSpecId = id;
          break;
        }
      }

      const specName = matchedSpecId
        ? SPECIALTIES_DATA[matchedSpecId]?.name
        : undefined;

      return NextResponse.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: specName
            ? `I can help you schedule an appointment with our **${specName}** department right now. You can pick your preferred physician, date, and convenient time window with zero upfront fee.`
            : `Booking an appointment on MedBridge Global is simple and takes under 2 minutes across 3 quick steps:\n\n1. **Choose Specialist**: Select from our 8 clinical departments or choose your preferred physician.\n2. **Patient Details**: Provide contact details and demographics.\n3. **Schedule Visit**: Choose an open calendar date and convenient time slot.\n\nWould you like me to open the booking wizard for you now?`,
          timestamp: new Date().toISOString(),
          actions: [
            {
              label: specName ? `Book ${specName} Visit` : "Book An Appointment",
              type: "booking",
              specialtyId: matchedSpecId,
            },
            {
              label: "View All 8 Specialties",
              type: "link",
              href: "/#specialties",
            },
          ],
        } as ChatMessageData,
      });
    }

    // 4. DOCTOR INQUIRIES & DISCOVERY
    if (
      cleanMsg.includes("doctor") ||
      cleanMsg.includes("physician") ||
      cleanMsg.includes("specialist") ||
      cleanMsg.includes("cardiologist") ||
      cleanMsg.includes("dermatologist") ||
      cleanMsg.includes("neurologist") ||
      cleanMsg.includes("internist")
    ) {
      // Find matching doctors if a specific doctor or discipline is mentioned
      const matchedDoctors = DOCTORS_DATA.filter((doc) => {
        return (
          cleanMsg.includes(doc.name.toLowerCase()) ||
          cleanMsg.includes(doc.specialtyName.toLowerCase()) ||
          cleanMsg.includes(doc.title.toLowerCase())
        );
      });

      if (matchedDoctors.length > 0) {
        const topDoctors = matchedDoctors.slice(0, 3);
        const docList = topDoctors
          .map(
            (d) =>
              `• **${d.name}** — ${d.specialtyName} (${d.experienceYears}+ yrs exp, ★ ${d.rating})`
          )
          .join("\n");

        return NextResponse.json({
          reply: {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `Here are our credentialed specialists matching your inquiry:\n\n${docList}\n\nAll MedBridge physicians are board-certified and hold verified hospital affiliations with modern in-clinic and telehealth availability.`,
            timestamp: new Date().toISOString(),
            actions: [
              {
                label: "Explore Doctor Directory",
                type: "link",
                href: "/doctors",
              },
              {
                label: "Book Appointment",
                type: "booking",
              },
            ],
          } as ChatMessageData,
        });
      }

      return NextResponse.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `MedBridge Global brings together over 30+ verified specialists across 8 core medical disciplines:\n\n• **Internal Medicine** & **Family Medicine**\n• **Cardiology** & **Neurology**\n• **Orthopedics & Spine**\n• **Dermatology & Skin Science**\n• **Pediatrics** & **Diagnostic Imaging**\n\nYou can review physician biographies, verified patient ratings, qualifications, and hospital affiliations directly in our directory.`,
          timestamp: new Date().toISOString(),
          actions: [
            {
              label: "Search Doctors Directory",
              type: "link",
              href: "/doctors",
            },
            {
              label: "Book with First Available",
              type: "booking",
            },
          ],
        } as ChatMessageData,
      });
    }

    // 5. SPECIALTY EXPLORATION
    if (
      cleanMsg.includes("specialt") ||
      cleanMsg.includes("department") ||
      cleanMsg.includes("cardiology") ||
      cleanMsg.includes("orthopedic") ||
      cleanMsg.includes("neurology") ||
      cleanMsg.includes("dermatology") ||
      cleanMsg.includes("pediatric") ||
      cleanMsg.includes("imaging") ||
      cleanMsg.includes("internal medicine") ||
      cleanMsg.includes("family medicine")
    ) {
      // Find matching specialty
      let matchedKey: string | null = null;
      for (const [key, spec] of Object.entries(SPECIALTIES_DATA)) {
        if (cleanMsg.includes(spec.name.toLowerCase()) || cleanMsg.includes(key)) {
          matchedKey = key;
          break;
        }
      }

      if (matchedKey) {
        const spec = SPECIALTIES_DATA[matchedKey];
        return NextResponse.json({
          reply: {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: `**${spec.name} Department**\n\n${spec.shortIntro}\n\nOur specialists treat conditions such as ${spec.conditions
              .map((c) => c.name)
              .slice(0, 4)
              .join(", ")} with non-invasive and preventative care pathways.`,
            timestamp: new Date().toISOString(),
            actions: [
              {
                label: `Explore ${spec.name}`,
                type: "link",
                href: `/specialties/${matchedKey}`,
              },
              {
                label: `Book ${spec.name} Visit`,
                type: "booking",
                specialtyId: matchedKey,
              },
            ],
          } as ChatMessageData,
        });
      }

      return NextResponse.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `MedBridge Global offers 8 integrated medical departments:\n\n1. **Internal Medicine** (adult chronic care & diagnostics)\n2. **Family Medicine** (multi-generational whole-family wellness)\n3. **Cardiology** (cardiovascular disease, ECG, echo & rhythm)\n4. **Orthopedics** (joint preservation, sports injury & mobility)\n5. **Neurology** (headache, stroke, nerve & cognitive health)\n6. **Dermatology** (clinical skin care, acne & mole mapping)\n7. **Pediatrics** (infant, child & adolescent medicine)\n8. **Diagnostic Imaging** (MRI, CT, ultrasound & report review)\n\nWhich department would you like to explore?`,
          timestamp: new Date().toISOString(),
          actions: [
            {
              label: "Explore Cardiology",
              type: "link",
              href: "/specialties/cardiology",
            },
            {
              label: "Explore Internal Medicine",
              type: "link",
              href: "/specialties/internal-medicine",
            },
            {
              label: "All Specialties",
              type: "link",
              href: "/#specialties",
            },
          ],
        } as ChatMessageData,
      });
    }

    // 6. SYMPTOM CHECK / GENERAL HEALTH QUESTIONS
    if (
      cleanMsg.includes("headache") ||
      cleanMsg.includes("fever") ||
      cleanMsg.includes("cough") ||
      cleanMsg.includes("back pain") ||
      cleanMsg.includes("knee") ||
      cleanMsg.includes("joint") ||
      cleanMsg.includes("skin") ||
      cleanMsg.includes("rash") ||
      cleanMsg.includes("dizzy") ||
      cleanMsg.includes("stomach") ||
      cleanMsg.includes("symptom") ||
      cleanMsg.includes("tired") ||
      cleanMsg.includes("fatigue")
    ) {
      let suggestedSpec = "internal-medicine";
      let suggestedSpecName = "Internal Medicine";

      if (cleanMsg.includes("headache") || cleanMsg.includes("dizzy")) {
        suggestedSpec = "neurology";
        suggestedSpecName = "Neurology";
      } else if (cleanMsg.includes("back pain") || cleanMsg.includes("knee") || cleanMsg.includes("joint")) {
        suggestedSpec = "orthopedics";
        suggestedSpecName = "Orthopedics";
      } else if (cleanMsg.includes("skin") || cleanMsg.includes("rash") || cleanMsg.includes("acne")) {
        suggestedSpec = "dermatology";
        suggestedSpecName = "Dermatology";
      } else if (cleanMsg.includes("heart") || cleanMsg.includes("palpitation") || cleanMsg.includes("blood pressure")) {
        suggestedSpec = "cardiology";
        suggestedSpecName = "Cardiology";
      }

      return NextResponse.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `Based on the symptoms you described, a consultation with our **${suggestedSpecName}** team is typically the recommended clinical pathway.\n\n*Note: This information is for general educational guidance and does not represent a formal medical diagnosis.*\n\nOur specialists can perform diagnostic evaluations, review relevant scans, and create a tailored recovery plan.`,
          timestamp: new Date().toISOString(),
          actions: [
            {
              label: `Consult a ${suggestedSpecName} Specialist`,
              type: "booking",
              specialtyId: suggestedSpec,
            },
            {
              label: `Learn About ${suggestedSpecName}`,
              type: "link",
              href: `/specialties/${suggestedSpec}`,
            },
          ],
        } as ChatMessageData,
      });
    }

    // 7. PRICING, PAYMENT & INSURANCE
    if (
      cleanMsg.includes("cost") ||
      cleanMsg.includes("price") ||
      cleanMsg.includes("insurance") ||
      cleanMsg.includes("payment") ||
      cleanMsg.includes("fee")
    ) {
      return NextResponse.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `**Transparent Pricing & Zero Upfront Fees:**\n\n• **Zero Upfront Payment**: Booking an appointment on MedBridge requires no upfront payment.\n• **Health Insurance**: We accept major international health insurance providers and local clinical networks.\n• **Transparent Consultation Fees**: Out-of-pocket consultation fees typically range between $150 – $220 depending on the medical specialty.\n• **Free Cancellation & Rescheduling**: You can reschedule your visit free of charge up to 4 hours before the appointment.`,
          timestamp: new Date().toISOString(),
          actions: [
            {
              label: "Book Appointment",
              type: "booking",
            },
            {
              label: "View Patient Portal",
              type: "link",
              href: "/appointments",
            },
          ],
        } as ChatMessageData,
      });
    }

    // 8. HOW CONSULTATIONS & APPOINTMENTS WORK
    if (
      cleanMsg.includes("how it works") ||
      cleanMsg.includes("process") ||
      cleanMsg.includes("telehealth") ||
      cleanMsg.includes("virtual") ||
      cleanMsg.includes("in person") ||
      cleanMsg.includes("location") ||
      cleanMsg.includes("where")
    ) {
      return NextResponse.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `**How MedBridge Global Coordinated Care Works:**\n\n1. **Select Specialist or Service**: Choose your physician and appointment date online.\n2. **Visit Confirmation**: Receive an instant booking reference code (e.g. \`MBG-2026-XXXX\`) and email itinerary.\n3. **Unhurried Consultation**: Meet in-person at the **MedBridge Global Health Pavilion** or via secure HD Telehealth.\n4. **Synchronized Records & Follow-up**: All diagnostic test summaries, lab reports, and doctor recommendations are available 24/7 in your online Patient Portal.`,
          timestamp: new Date().toISOString(),
          actions: [
            {
              label: "Book a Consultation",
              type: "booking",
            },
            {
              label: "Access Patient Portal",
              type: "link",
              href: "/appointments",
            },
          ],
        } as ChatMessageData,
      });
    }

    // 9. PATIENT PORTAL & APPOINTMENT LOOKUP
    if (
      cleanMsg.includes("my appointment") ||
      cleanMsg.includes("existing appointment") ||
      cleanMsg.includes("cancel") ||
      cleanMsg.includes("receipt") ||
      cleanMsg.includes("reference") ||
      cleanMsg.includes("portal")
    ) {
      return NextResponse.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `You can access your upcoming visits, download confirmation receipts, and view consultation summaries anytime through our **Patient Portal**.\n\nSimply enter your registered email address or appointment reference code (e.g. \`MBG-2026-XXXX\`).`,
          timestamp: new Date().toISOString(),
          actions: [
            {
              label: "Open Patient Portal",
              type: "link",
              href: "/appointments",
            },
            {
              label: "Book New Appointment",
              type: "booking",
            },
          ],
        } as ChatMessageData,
      });
    }

    // 10. CONTACT / SUPPORT
    if (
      cleanMsg.includes("contact") ||
      cleanMsg.includes("support") ||
      cleanMsg.includes("help") ||
      cleanMsg.includes("phone") ||
      cleanMsg.includes("email")
    ) {
      return NextResponse.json({
        reply: {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `**MedBridge Global Patient Support:**\n\n• **Clinical Pavilion**: MedBridge Global Health Center\n• **Email**: support@medbridgeglobal.com\n• **Care Coordination**: +1 (555) 234-5678\n• **Operating Hours**: Mon – Sat, 08:00 AM – 08:00 PM\n\nOur clinical care coordinators are available to assist with records transfer, doctor recommendations, and appointment changes.`,
          timestamp: new Date().toISOString(),
          actions: [
            {
              label: "Book Appointment",
              type: "booking",
            },
            {
              label: "View Contact Page",
              type: "link",
              href: "/#contact",
            },
          ],
        } as ChatMessageData,
      });
    }

    // 11. GENERAL HEALTH / FRIENDLY GREETING FALLBACK
    return NextResponse.json({
      reply: {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: `I'm here to assist you with MedBridge Global's healthcare services. You can ask me about:\n\n• **Finding a physician** across our 8 medical specialties\n• **Scheduling an appointment** with zero upfront fee\n• **Understanding symptoms** and identifying the right department\n• **Reviewing your existing appointments** in the patient portal\n• **Platform details**, insurance coverage, and telehealth services\n\nHow can I help you take the next step in your care today?`,
        timestamp: new Date().toISOString(),
        actions: [
          {
            label: "Book an Appointment",
            type: "booking",
          },
          {
            label: "Explore Specialties",
            type: "link",
            href: "/#specialties",
          },
          {
            label: "Find a Doctor",
            type: "link",
            href: "/doctors",
          },
        ],
      } as ChatMessageData,
    });
  } catch (error) {
    console.error("Error in AI chatbot route:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response. Please try again." },
      { status: 500 }
    );
  }
}

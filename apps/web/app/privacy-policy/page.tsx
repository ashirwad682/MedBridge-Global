import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Server,
  Activity,
  Bot,
  AlertTriangle,
  Clock,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Database,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | MedBridge Global Healthcare",
  description:
    "Comprehensive Privacy Policy detailing how MedBridge Global collects, protects, synchronizes, and encrypts patient and physician health information across our Web, Mobile, and Clinical Backend services.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "overview", label: "1. Platform Overview & Scope" },
    { id: "data-collection", label: "2. Information We Collect" },
    { id: "how-we-use", label: "3. How We Process Clinical Data" },
    { id: "ai-assistant", label: "4. AI Medical Assistant Processing" },
    { id: "security-rbac", label: "5. Data Security & RBAC Controls" },
    { id: "digital-pass", label: "6. Digital Passes & Booking Records" },
    { id: "retention", label: "7. Data Retention & Archival" },
    { id: "user-rights", label: "8. Patient & Physician Rights" },
    { id: "compliance", label: "9. Regulatory & HIPAA Alignment" },
    { id: "contact", label: "10. Privacy Officer & Inquiries" },
  ];

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#7657ff] dark:text-[#a99aff] text-[11px] font-bold tracking-[0.16em] uppercase mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              CLINICAL COMPLIANCE & PRIVACY
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-4">
              MedBridge Global Privacy Policy
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We hold protected health information (PHI) and clinical records to the highest standards of confidentiality, role-based encryption, and zero-compromise security across our Web Portal, Mobile Applications, and Microservice APIs.
            </p>
          </div>

          {/* Policy Meta Highlights */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Last Updated
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                November 2026
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Version
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                2.4.0 (Enterprise)
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Framework Alignment
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                HIPAA & GDPR Aware
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Data Selling Policy
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                Zero Commercial Sale
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pb-20 relative">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Sticky Table of Contents (Desktop) */}
            <aside className="lg:col-span-4 sticky top-24 z-20">
              <div className="p-5 sm:p-6 rounded-[24px] bg-white/65 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-lg space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-200/70 dark:border-white/10">
                  <FileText className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Policy Sections
                  </h2>
                </div>
                <nav className="space-y-1" aria-label="Table of Contents">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center justify-between px-3 py-2 text-xs rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-[#7657ff] dark:hover:text-[#a99aff] hover:bg-purple-500/[0.06] transition-all"
                    >
                      <span className="truncate">{section.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                    </a>
                  ))}
                </nav>

                <div className="pt-4 border-t border-neutral-200/70 dark:border-white/10">
                  <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/30">
                    <p className="text-[11px] font-semibold text-[#7657ff] dark:text-[#a99aff] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Direct Privacy Contact
                    </p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">
                      Have questions regarding your clinical data records?
                    </p>
                    <a
                      href="mailto:privacy@medbridgeglobal.care"
                      className="text-[11px] font-semibold text-[#7657ff] dark:text-[#a99aff] underline mt-1.5 inline-block"
                    >
                      privacy@medbridgeglobal.care
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Column: In-depth Legal & Operational Clauses */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Important Medical Disclaimer Callout */}
              <div className="p-6 rounded-[24px] bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                  <h3 className="font-bold text-amber-900 dark:text-amber-300">
                    Crucial Clinical Notice
                  </h3>
                  <p className="leading-relaxed">
                    MedBridge Global is an interactive appointment coordination, physician discovery, and clinical record synchronization platform. It is <strong>NOT</strong> an emergency response system. If you are experiencing a life-threatening medical emergency (such as severe chest pain, acute shortness of breath, sudden numbness, or heavy trauma), dial your local emergency services (e.g., 911 / 112) or report to the nearest hospital emergency room immediately.
                  </p>
                </div>
              </div>

              {/* Section 1 */}
              <article id="overview" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Platform Overview & Scope
                  </h2>
                </div>
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 space-y-3">
                  <p>
                    This Privacy Policy applies to all services, websites, mobile applications (iOS and Android), APIs, and healthcare workflow utilities provided by <strong>MedBridge Global Inc.</strong> (&quot;MedBridge Global&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                  </p>
                  <p>
                    Our ecosystem is purpose-built to bridge patients with licensed, board-certified medical specialists across 8 distinct clinical domains (including Internal Medicine, Cardiology, Orthopedics, Neurology, Dermatology, Pediatrics, Family Medicine, and Diagnostic Imaging). We synchronize appointment scheduling, digital consultation passes, medical record storage, and clinical queue management with uncompromised integrity.
                  </p>
                </div>
              </article>

              {/* Section 2 */}
              <article id="data-collection" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Information We Collect
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  We collect and process only the minimum necessary information required to facilitate clinical consultations, authenticate user roles, and deliver coordinated medical care:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                      <UserCheck className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff]" />
                      Patient Profile & Clinical Background
                    </div>
                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Full Legal Name, Email, and Phone Number</li>
                      <li>Date of Birth, Biological Gender, Blood Group</li>
                      <li>Documented Allergies and Chronic Medical Conditions</li>
                      <li>Emergency Contact Name, Phone, and Relationship</li>
                      <li>Insurance Provider and Policy Identification Numbers</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                      <Activity className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff]" />
                      Physician Credentials & Practice Data
                    </div>
                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Official State/National Medical Registration Number</li>
                      <li>Board Certifications, Fellowships, and Qualifications</li>
                      <li>Hospital Affiliations and Clinic Locations</li>
                      <li>Clinical Specialty Disciplines and Experience Years</li>
                      <li>Declared Consultation Fee Schedule and Clinical Slots</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                      <Clock className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff]" />
                      Consultation & Appointment Data
                    </div>
                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Selected Specialist, Discipline, and Consultation Date</li>
                      <li>Mode of Consultation: In-Person vs. Virtual Video</li>
                      <li>Chief Clinical Complaint or Reason for Visit</li>
                      <li>Unique Digital Pass Identifier (e.g. <code>MBG-2026-XXXX</code>)</li>
                      <li>Clinical Progress Status: Pending, Checked-In, In-Consultation, Completed</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                      <Server className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff]" />
                      Technical & Security Audit Logs
                    </div>
                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>IP address, browser user-agent, operating system</li>
                      <li>Immutable clinical audit trails for record access</li>
                      <li>Authentication session cookies (HTTP-only, Secure)</li>
                      <li>Email verification and cryptographic password reset tokens</li>
                    </ul>
                  </div>
                </div>
              </article>

              {/* Section 3 */}
              <article id="how-we-use" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    How We Process Clinical Data
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    Every byte of data collected through MedBridge Global serves a direct clinical or administrative function. Specifically, we process your data to:
                  </p>
                  <div className="space-y-2 pt-1">
                    <div className="p-3.5 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 dark:text-white">Zero-Wait Scheduling:</strong> Synchronize real-time physician time slots, reserve appointments without double-booking, and manage live queue transitions.
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 dark:text-white">Unified Clinical Records:</strong> Store consultation notes, diagnoses, and lab summaries so collaborating specialists have accurate history without duplicate testing.
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 dark:text-white">Digital Pass Issuance:</strong> Generate encrypted digital consultation passes for seamless clinic check-ins and identity validation.
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 dark:text-white">Transactional Health Alerts:</strong> Send booking confirmations, appointment reminders, and password reset notifications. We <em>never</em> send third-party advertising or spam.
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 4 */}
              <article id="ai-assistant" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    AI Medical Assistant Processing
                  </h2>
                </div>
                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-xl space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#7657ff] dark:text-[#a99aff]">
                    <Bot className="w-4 h-4" /> Medical AI Orb Data Protection Standards
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-2">
                    <p>
                      The MedBridge Global floating AI Medical Orb (powered by our <code>/api/chat</code> endpoint) provides conversational symptom guidance, department matching, and general health literacy.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-xs">
                      <li><strong>Zero Training on Personal PHI:</strong> Your health queries and symptom inputs are <em>never</em> used to train public foundation models.</li>
                      <li><strong>Ephemeral Session Data:</strong> Chat interactions are maintained only in your local session and are not permanently linked to your longitudinal medical records without your explicit clinical consent.</li>
                      <li><strong>Advisory Limitation:</strong> The AI Medical Assistant does not generate clinical diagnoses or prescribe pharmaceuticals. It directs you to the proper board-certified specialist.</li>
                    </ul>
                  </div>
                </div>
              </article>

              {/* Section 5 */}
              <article id="security-rbac" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    05
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Data Security & Role-Based Access Control (RBAC)
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    We implement defense-in-depth engineering to isolate patient data. Our backend enforces rigorous Role-Based Access Control:
                  </p>
                  
                  {/* RBAC Breakdown Table */}
                  <div className="overflow-x-auto rounded-2xl border border-neutral-200/70 dark:border-white/10 mt-3">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-100/70 dark:bg-white/[0.04] text-neutral-900 dark:text-white font-semibold">
                        <tr>
                          <th className="p-3 sm:p-4">User Role</th>
                          <th className="p-3 sm:p-4">Accessible Scope</th>
                          <th className="p-3 sm:p-4">Strict Restrictions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200/60 dark:divide-white/10 text-neutral-600 dark:text-neutral-300">
                        <tr>
                          <td className="p-3 sm:p-4 font-semibold text-[#7657ff] dark:text-[#a99aff]">Patient</td>
                          <td className="p-3 sm:p-4">Own consultation passes, booked slots, profile, and personal record archive.</td>
                          <td className="p-3 sm:p-4">Cannot view other patients, doctor schedules, or clinical queue backends.</td>
                        </tr>
                        <tr>
                          <td className="p-3 sm:p-4 font-semibold text-[#7657ff] dark:text-[#a99aff]">Physician</td>
                          <td className="p-3 sm:p-4">Assigned clinic queue, patient reason for visit, scheduled slots, and own profile.</td>
                          <td className="p-3 sm:p-4">Cannot inspect records of patients who have not scheduled with them.</td>
                        </tr>
                        <tr>
                          <td className="p-3 sm:p-4 font-semibold text-[#7657ff] dark:text-[#a99aff]">System Admin</td>
                          <td className="p-3 sm:p-4">Platform audit trails, doctor credentialing verification, and infrastructure status.</td>
                          <td className="p-3 sm:p-4">Subject to strict cryptographic access logging via <code>AuditLog.ts</code>.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="pt-2">
                    Passwords are encrypted with <strong>bcryptjs</strong> (salt factor 10). Session authentication utilizes stateless JSON Web Tokens (JWT) signed with HMAC-SHA256 and transported strictly in <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Lax</code> cookies to prevent Cross-Site Scripting (XSS) and CSRF attacks.
                  </p>
                </div>
              </article>

              {/* Section 6 */}
              <article id="digital-pass" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    06
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Digital Passes & Booking Records
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    Every confirmed appointment generates a tamper-evident reference pass (e.g., <code>MBG-2026-8812</code>). This code acts as a single-use credential for in-person clinic entry or encrypted virtual video room access.
                  </p>
                  <p>
                    The pass contains cryptographic metadata tying the patient to the attending specialist and scheduled time slot. Once a consultation reaches <code>COMPLETED</code> or <code>CANCELLED</code> status, the token becomes read-only and is preserved exclusively for historical records and audit review.
                  </p>
                </div>
              </article>

              {/* Section 7 */}
              <article id="retention" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    07
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Data Retention & Archival
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    In compliance with medical record regulations:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs">
                    <li><strong>Active Profiles:</strong> Retained while your account remains open or until an explicit deactivation request is submitted.</li>
                    <li><strong>Clinical Consultation Records:</strong> Retained for a mandatory statutory period (typically 7 years for adults, and until age 28 for pediatric consultations) in accordance with clinical documentation laws.</li>
                    <li><strong>Audit & Security Trails:</strong> Stored for 365 days to ensure ongoing operational verification, anomaly detection, and fraud prevention.</li>
                  </ul>
                </div>
              </article>

              {/* Section 8 */}
              <article id="user-rights" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    08
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Patient & Physician Rights
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    Regardless of your geographic location, MedBridge Global extends the following fundamental privacy rights to all registered users:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 space-y-1">
                      <strong className="text-neutral-900 dark:text-white text-xs block">Right to Access & Portability</strong>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
                        Download an electronic summary of your appointments, digital passes, and verified clinical profile.
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 space-y-1">
                      <strong className="text-neutral-900 dark:text-white text-xs block">Right to Rectification</strong>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
                        Update emergency contacts, phone numbers, or insurance policy information through the Patient Dashboard.
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 space-y-1">
                      <strong className="text-neutral-900 dark:text-white text-xs block">Right to Erasure (De-identification)</strong>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
                        Request account termination and personal data de-identification, subject to statutory healthcare retention laws.
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 space-y-1">
                      <strong className="text-neutral-900 dark:text-white text-xs block">Right to Revoke Permissions</strong>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
                        Revoke upcoming consultation permissions or cancel scheduled appointments at any time prior to visit check-in.
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 9 */}
              <article id="compliance" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    09
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Regulatory & HIPAA Alignment
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    MedBridge Global is engineered in accordance with key global health privacy and electronic data guidelines:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs">
                    <li><strong>Health Insurance Portability and Accountability Act (HIPAA):</strong> Physical, technical, and administrative safeguards to uphold the privacy and security of Protected Health Information.</li>
                    <li><strong>General Data Protection Regulation (GDPR):</strong> Lawful basis of processing, explicit consent mechanisms, and cross-border clinical data transfer safeguards.</li>
                    <li><strong>Digital Personal Data Protection Act (DPDPA):</strong> Purpose limitation, security safeguards, and grievance redressal mechanisms for our Indian and global patient networks.</li>
                  </ul>
                </div>
              </article>

              {/* Section 10 */}
              <article id="contact" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    10
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Privacy Officer & Inquiries
                  </h2>
                </div>
                <div className="p-6 rounded-[24px] bg-white/60 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 space-y-4">
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    If you have questions, concerns, or requests regarding this Privacy Policy or wish to exercise your data rights, contact our Data Protection Officer:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                      <Mail className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0" />
                      <span>privacy@medbridgeglobal.care</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                      <Phone className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0" />
                      <span>+1 (800) 415-CARE (Ext. 4)</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300">
                      <MapPin className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0" />
                      <span>Health Pavilion, Suite 900</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
                    <span>MedBridge Global Inc. — Trust & Clinical Compliance Office</span>
                    <Link
                      href="/terms-of-service"
                      className="text-[#7657ff] dark:text-[#a99aff] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      View Terms & Conditions of Service <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

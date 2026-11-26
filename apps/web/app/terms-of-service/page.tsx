import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FileCheck2,
  AlertOctagon,
  Scale,
  Calendar,
  Stethoscope,
  Video,
  Bot,
  UserCheck,
  ShieldAlert,
  Clock,
  HelpCircle,
  FileText,
  ChevronRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions of Service | MedBridge Global Healthcare",
  description:
    "Official Terms and Conditions of Service governing the use of MedBridge Global Web Portal, Mobile Applications, Physician Discovery, Appointment Scheduling, and Digital Consultation Passes.",
};

export default function TermsOfServicePage() {
  const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms & Eligibility" },
    { id: "emergency-notice", label: "2. Medical Disclaimer & Emergency Notice" },
    { id: "user-roles", label: "3. User Roles & Account Obligations" },
    { id: "scheduling", label: "4. Appointments, Booking & Cancellation" },
    { id: "digital-pass", label: "5. Digital Passes & Clinical Check-In" },
    { id: "teleconsultation", label: "6. Virtual & In-Person Care Guidelines" },
    { id: "physician-autonomy", label: "7. Physician Independence & Standards" },
    { id: "ai-assistant", label: "8. AI Medical Assistant Terms of Use" },
    { id: "prohibited-conduct", label: "9. Prohibited Conduct & Misuse" },
    { id: "intellectual-property", label: "10. Intellectual Property Rights" },
    { id: "liability", label: "11. Limitation of Liability & Warranty" },
    { id: "governing-law", label: "12. Governing Law & Dispute Resolution" },
  ];

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#7657ff] dark:text-[#a99aff] text-[11px] font-bold tracking-[0.16em] uppercase mb-4">
              <Scale className="w-3.5 h-3.5" />
              LEGAL TERMS & CLINICAL POLICIES
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-4">
              Terms & Conditions of Service
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              These terms form a legally binding contract governing your access to the MedBridge Global platform, physician appointment scheduling, digital consultation passes, and synchronized healthcare services.
            </p>
          </div>

          {/* Highlights */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Effective Date
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                November 2026
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Jurisdiction
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                Global Healthcare Standard
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                User Roles
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                Patients & Physicians
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Emergency Service
              </span>
              <span className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400 mt-1 block">
                Not for Emergencies
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
                    Agreement Sections
                  </h2>
                </div>
                <nav className="space-y-1" aria-label="Terms of Service Index">
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
                      <HelpCircle className="w-3.5 h-3.5" /> Legal Operations Team
                    </p>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">
                      Questions regarding our provider agreements or terms?
                    </p>
                    <a
                      href="mailto:legal@medbridgeglobal.care"
                      className="text-[11px] font-semibold text-[#7657ff] dark:text-[#a99aff] underline mt-1.5 inline-block"
                    >
                      legal@medbridgeglobal.care
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Column: Terms Clauses */}
            <div className="lg:col-span-8 space-y-12">

              {/* Crucial Emergency Disclaimer Notice */}
              <div className="p-6 rounded-[24px] bg-rose-500/10 border border-rose-500/20 backdrop-blur-xl flex items-start gap-4">
                <AlertOctagon className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                  <h3 className="font-bold text-rose-950 dark:text-rose-300">
                    MANDATORY MEDICAL EMERGENCY DISCLAIMER
                  </h3>
                  <p className="leading-relaxed">
                    MedBridge Global is <strong>NOT</strong> an emergency medical service, triage hotline, or immediate response system. Do NOT use this platform for acute or life-threatening symptoms, including chest pain, stroke symptoms, acute shortness of breath, severe hemorrhaging, or thoughts of self-harm. In such events, immediately telephone emergency numbers (<strong>911 in USA / Canada, 112 in India & EU</strong>) or report to the nearest hospital casualty department.
                  </p>
                </div>
              </div>

              {/* Section 1 */}
              <article id="acceptance" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Acceptance of Terms & Eligibility
                  </h2>
                </div>
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 space-y-3">
                  <p>
                    By creating an account, browsing our physician directory, scheduling an appointment, or using our mobile and web applications, you agree to be bound by these Terms & Conditions of Service and our Privacy Policy. If you do not accept all terms, you must discontinue use of the platform immediately.
                  </p>
                  <p>
                    <strong>Eligibility:</strong> You must be at least 18 years of age to establish an independent Patient or Physician account. Appointments for pediatric patients (individuals under 18) must be scheduled, managed, and authorized by a custodial parent or legal guardian.
                  </p>
                </div>
              </article>

              {/* Section 2 */}
              <article id="emergency-notice" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Nature of Services & Medical Disclaimer
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    MedBridge Global provides digital coordination infrastructure that connects patients with licensed physicians, department heads, and clinics across 8 clinical specialties (Internal Medicine, Cardiology, Orthopedics, Neurology, Dermatology, Pediatrics, Family Medicine, and Diagnostic Imaging).
                  </p>
                  <div className="p-4 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 space-y-2">
                    <p className="font-semibold text-neutral-900 dark:text-white">Key Platform Distinctions:</p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs">
                      <li><strong>No Direct Practice of Medicine:</strong> MedBridge Global as a technology corporation does not practice medicine. The physician-patient relationship is formed directly between you and the board-certified doctor you consult with.</li>
                      <li><strong>Content Is Informational:</strong> Specialty profiles, condition overviews, diagnostic descriptions, and articles on this site are for educational purposes and do not substitute for individual clinical diagnosis.</li>
                    </ul>
                  </div>
                </div>
              </article>

              {/* Section 3 */}
              <article id="user-roles" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    User Roles & Account Obligations
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 space-y-2.5">
                    <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                      <UserCheck className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff]" />
                      Patient Account Responsibilities
                    </div>
                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Provide truthful, accurate personal and clinical background information (allergies, ongoing medications, chronic conditions).</li>
                      <li>Safeguard authentication credentials; notify MedBridge Global immediately of any unauthorized account access.</li>
                      <li>Honor scheduled appointment slots or submit timely cancellations through the Patient Portal.</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 space-y-2.5">
                    <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white">
                      <Stethoscope className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff]" />
                      Physician & Provider Responsibilities
                    </div>
                    <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Hold active, valid medical licenses in good standing with state/national medical councils.</li>
                      <li>Accurately declare hospital affiliations, board credentials, and consultation fee structures.</li>
                      <li>Maintain active clinic queues, adhere to agreed zero-wait slot commitments, and maintain strict patient confidentiality.</li>
                    </ul>
                  </div>
                </div>
              </article>

              {/* Section 4 */}
              <article id="scheduling" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Appointments, Booking & Cancellation
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    Our platform provides instantaneous slot booking across doctors and specialties:
                  </p>
                  <div className="space-y-2">
                    <div className="p-3.5 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 dark:text-white">Instant Slot Locking:</strong> Selecting an available date and time slot temporarily holds that slot to prevent simultaneous double-booking. Confirmation generates an immediate digital pass.
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 dark:text-white">Cancellation Policy:</strong> Patients may cancel scheduled consultations through the <Link href="/appointments" className="text-[#7657ff] dark:text-[#a99aff] underline">Patient Appointments Portal</Link> up to 2 hours before the scheduled appointment without penalty.
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/10 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 dark:text-white">Rescheduling:</strong> If a specialist must reschedule due to clinical hospital emergencies, patients are notified with options to confirm the alternate slot or select an immediate peer specialist.
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 5 */}
              <article id="digital-pass" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    05
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Digital Passes & Clinical Check-In
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    Every confirmed appointment issues an authoritative Digital Consultation Pass identified by an alphanumeric code (e.g. <code>MBG-2026-XXXX</code>).
                  </p>
                  <p>
                    <strong>In-Person Check-In:</strong> Present your digital consultation pass on your smartphone or printout at the clinic or hospital front desk to trigger your queue advancement from <code>CONFIRMED</code> to <code>CHECKED_IN</code> in the attending doctor&apos;s queue.
                  </p>
                  <p>
                    <strong>Virtual Teleconsultation:</strong> The digital pass provides encrypted tokenized entry into the designated telehealth room. Sharing or transferring passes to unauthorized third parties is strictly prohibited.
                  </p>
                </div>
              </article>

              {/* Section 6 */}
              <article id="teleconsultation" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    06
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Virtual Video & In-Person Care Guidelines
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    MedBridge Global supports both in-clinic consultations and encrypted virtual video visits:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs">
                    <li><strong>Technical Readiness:</strong> For video consultations, you are responsible for maintaining a reliable internet connection, working webcam, and quiet, private environment.</li>
                    <li><strong>Clinical Suitability:</strong> Certain conditions require physical examination, palpation, or diagnostic imaging. Attending physicians retain full authority to require an in-person clinic visit if virtual assessment is deemed clinically insufficient.</li>
                  </ul>
                </div>
              </article>

              {/* Section 7 */}
              <article id="physician-autonomy" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    07
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Physician Independence & Clinical Autonomy
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    Physicians listed on MedBridge Global are independent medical practitioners. MedBridge Global does not interfere with, dictate, or influence any clinical judgment, diagnosis, treatment regimen, or prescription issued by a licensed provider.
                  </p>
                  <p>
                    Each physician carries independent professional malpractice insurance and remains solely accountable for clinical care delivered to patients under applicable professional licensing boards.
                  </p>
                </div>
              </article>

              {/* Section 8 */}
              <article id="ai-assistant" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    08
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    AI Medical Assistant Terms of Use
                  </h2>
                </div>
                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 backdrop-blur-xl space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#7657ff] dark:text-[#a99aff]">
                    <Bot className="w-4 h-4" /> AI Assistant Operational Boundaries
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    The MedBridge Global AI Medical Orb is an informational guidance tool designed to assist with department discovery, symptom vocabulary, and pre-consultation orientation:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                    <li>It does not create a doctor-patient relationship.</li>
                    <li>It does not issue binding medical diagnoses, dosages, or drug prescriptions.</li>
                    <li>You agree not to rely solely on AI assistant outputs for medical decisions without consulting a verified physician.</li>
                  </ul>
                </div>
              </article>

              {/* Section 9 */}
              <article id="prohibited-conduct" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    09
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Prohibited Platform Conduct
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    Users must not engage in any activity that compromises clinical safety, platform security, or user confidentiality. Prohibited actions include:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 space-y-1">
                      <strong className="text-rose-950 dark:text-rose-300 text-xs block">False Identity or Credentials</strong>
                      <span className="text-[11px] text-neutral-600 dark:text-neutral-400 block">
                        Falsifying medical registration credentials, impersonating doctors, or booking consultations under fraudulent identities.
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 space-y-1">
                      <strong className="text-rose-950 dark:text-rose-300 text-xs block">Unauthorized Data Infiltration</strong>
                      <span className="text-[11px] text-neutral-600 dark:text-neutral-400 block">
                        Attempting to bypass RBAC filters, scraping clinical directories, or intercepting API session tokens.
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 space-y-1">
                      <strong className="text-rose-950 dark:text-rose-300 text-xs block">Slot Hoarding & Denial of Care</strong>
                      <span className="text-[11px] text-neutral-600 dark:text-neutral-400 block">
                        Automated bot booking, repetitive cancellations, or blocking physician appointment availability maliciously.
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 space-y-1">
                      <strong className="text-rose-950 dark:text-rose-300 text-xs block">Harassment of Clinical Staff</strong>
                      <span className="text-[11px] text-neutral-600 dark:text-neutral-400 block">
                        Abusive language, harassment, or inappropriate conduct toward physicians, clinic staff, or support coordinators.
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Section 10 */}
              <article id="intellectual-property" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    10
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Intellectual Property Rights
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    All visual design elements, glassmorphism layouts, brand assets, logos, typography, software code, and architecture comprising the MedBridge Global platform are proprietary to <strong>MedBridge Global Inc.</strong> and protected by international intellectual property laws.
                  </p>
                  <p>
                    Patients and physicians are granted a revocable, non-exclusive, non-transferable license to access the portal solely for legitimate medical appointment coordination and personal record management.
                  </p>
                </div>
              </article>

              {/* Section 11 */}
              <article id="liability" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    11
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Limitation of Liability & Warranty
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-3">
                  <p>
                    The platform and all automated tools are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. To the maximum extent permitted by applicable law, MedBridge Global disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, or non-infringement.
                  </p>
                  <p>
                    In no event shall MedBridge Global be liable for any indirect, consequential, punitive, or incidental damages arising out of physician clinical advice, delays caused by telecommunication failures, or unauthorized third-party access resulting from user credential compromise.
                  </p>
                </div>
              </article>

              {/* Section 12 */}
              <article id="governing-law" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center font-bold text-xs">
                    12
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Governing Law & Legal Contact
                  </h2>
                </div>
                <div className="p-6 rounded-[24px] bg-white/60 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 space-y-4">
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    These Terms shall be governed and construed in accordance with standard healthcare technology laws, without regard to conflict of law provisions. Disputes arising from these terms shall be subject to confidential binding arbitration.
                  </p>
                  
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-neutral-200/60 dark:border-white/10 text-xs">
                    <div>
                      <span className="font-semibold text-neutral-900 dark:text-white block">Legal & Regulatory Affairs</span>
                      <span className="text-neutral-500">MedBridge Global Pavilion, Legal Division</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link
                        href="/privacy-policy"
                        className="text-[#7657ff] dark:text-[#a99aff] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Review Privacy Policy <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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

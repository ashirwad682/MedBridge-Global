"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Headphones,
  ArrowRight,
  ChevronDown,
  Copy,
  Check,
  Calendar,
  Loader2,
  FileText,
  Building2,
} from "lucide-react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  department: string;
  urgency: "routine" | "urgent";
  preferredContactMethod: "email" | "phone" | "sms";
  subject: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  consent?: string;
}

const DEPARTMENTS = [
  { id: "general", label: "General Inquiries", desc: "General platform & service questions" },
  { id: "scheduling", label: "Appointments & Scheduling", desc: "Book, reschedule, or cancel consultations" },
  { id: "specialist", label: "Specialist Care & Triage", desc: "Guidance on finding the right physician" },
  { id: "records", label: "Medical Records & HIPAA", desc: "EHR access, lab records, & diagnostic files" },
  { id: "billing", label: "Billing & Insurance", desc: "Coverage validation & billing statements" },
  { id: "partnerships", label: "Clinical Partnerships", desc: "Hospital networks & physician joining" },
];

const FAQS = [
  {
    q: "How quickly will a care coordinator respond?",
    a: "Routine inquiries are typically reviewed within 4 to 8 business hours (guaranteed within 24 hours). For urgent consultations, our on-duty triage coordinators respond within 2 hours.",
  },
  {
    q: "Can I request consultation with a specific physician directly?",
    a: "Yes! You can specify the physician's name in your message, or visit our Doctors Directory to book an available time slot directly with immediate clinical confirmation.",
  },
  {
    q: "How is my personal medical data protected?",
    a: "MedBridge Global adheres strictly to HIPAA regulations. All messages, health summaries, and records transmitted through our platform are protected using AES-256 encryption at rest and in transit.",
  },
  {
    q: "What if I require immediate emergency medical care?",
    a: "MedBridge Global provides outpatient and coordinated specialist care. If you are experiencing a life-threatening emergency, chest pain, or acute trauma, please immediately call 911 or go to the nearest emergency room.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    department: "general",
    urgency: "routine",
    preferredContactMethod: "email",
    subject: "",
    message: "",
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketId: string;
    expectedResponseTime: string;
  } | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = "Please enter your full name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!emailRegex.test(form.email.trim())) {
      errs.email = "Please provide a valid email format (e.g. name@example.com).";
    }

    if (form.phone.trim()) {
      const phoneDigits = form.phone.replace(/[^0-9]/g, "");
      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        errs.phone = "Please enter a valid phone number (7-15 digits).";
      }
    }

    if (!form.subject.trim() || form.subject.trim().length < 3) {
      errs.subject = "Please enter a subject (at least 3 characters).";
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      errs.message = "Please describe your inquiry with at least 10 characters.";
    }

    if (!form.consent) {
      errs.consent = "You must acknowledge the HIPAA privacy disclosure to proceed.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to submit your inquiry. Please try again.");
      }

      setSubmittedTicket({
        ticketId: data.ticketId,
        expectedResponseTime: data.expectedResponseTime || "Within 24 hours",
      });
    } catch (err: any) {
      setSubmitError(err.message || "A network or server error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketId = () => {
    if (!submittedTicket) return;
    navigator.clipboard.writeText(submittedTicket.ticketId);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2500);
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      department: "general",
      urgency: "routine",
      preferredContactMethod: "email",
      subject: "",
      message: "",
      consent: false,
    });
    setErrors({});
    setSubmittedTicket(null);
    setSubmitError(null);
  };

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      {/* Floating Glass Navigation */}
      <Navbar />

      {/* Main Page Wrapper */}
      <div className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* Header Hero Banner */}
        <div className="max-w-3xl mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7657ff]/10 text-[#7657ff] dark:text-[#a99aff] text-[11px] font-bold tracking-[0.16em] uppercase mb-3 border border-[#7657ff]/20">
            <Headphones className="w-3.5 h-3.5" />
            <span>24/7 Clinical Coordination & Patient Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Contact MedBridge Global
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
            Whether you need guidance connecting with a specialist, have questions regarding your synchronized medical records, or wish to explore clinical partnerships, our care teams are ready to help.
          </p>

          {/* Emergency Advisory Pill */}
          <div className="mt-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Medical Emergency Notice:</strong> If you or someone with you is experiencing a medical emergency, acute chest pain, or severe symptoms, please immediately dial <strong>911</strong> or proceed to the nearest emergency department.
            </span>
          </div>
        </div>

        {/* 4 Contact Channels Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 md:mb-16">
          {/* Card 1: Emergency & Urgent Care Line */}
          <div className="p-5 sm:p-6 rounded-[24px] bg-white/55 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center mb-4 border border-[#7657ff]/20">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1">
                Direct Hotline
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                +1 (800) 415-CARE
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Toll-free dedicated clinical telephone assistance for patients and providers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-white/10 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Available 24/7/365</span>
            </div>
          </div>

          {/* Card 2: Patient Care Coordination */}
          <div className="p-5 sm:p-6 rounded-[24px] bg-white/55 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center mb-4 border border-[#7657ff]/20">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1">
                Care Coordination
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1 truncate">
                coordination@medbridgeglobal.care
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Direct email intake for general patient requests and specialty guidance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-white/10 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Mon–Sat: 7:00 AM – 9:00 PM EST</span>
            </div>
          </div>

          {/* Card 3: Medical Pavilion Headquarters */}
          <div className="p-5 sm:p-6 rounded-[24px] bg-white/55 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center mb-4 border border-[#7657ff]/20">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1">
                Clinical Pavilion
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                500 Medical Center Way
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Suite 400, New York, NY 10016. In-person outpatient suites and labs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-white/10 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Outpatient Consultations</span>
            </div>
          </div>

          {/* Card 4: Records & HIPAA Department */}
          <div className="p-5 sm:p-6 rounded-[24px] bg-white/55 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center mb-4 border border-[#7657ff]/20">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1">
                EHR & Records
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1 truncate">
                records@medbridgeglobal.care
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Secure electronic medical record access, audit inquiries, and disclosures.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-white/10 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>HIPAA Encrypted Portal</span>
            </div>
          </div>
        </div>

        {/* Two-Column Form & Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (5 Cols): Clinical Guarantees & Interactive FAQ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Consultation Booking Card */}
            <div className="p-6 sm:p-7 rounded-[28px] bg-gradient-to-br from-[#7657ff]/15 via-purple-500/5 to-transparent dark:from-[#7657ff]/20 dark:via-purple-500/10 backdrop-blur-2xl border border-[#7657ff]/30 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1">
                  INSTANT ACCESS
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-2">
                  Need to see a doctor directly?
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                  Skip the wait and reserve an appointment directly with board-certified physicians across 8 medical specialties.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/doctors"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <span>Browse Doctors</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 text-neutral-800 dark:text-neutral-200 text-xs font-semibold border border-white/80 dark:border-white/15 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#7657ff]" />
                    <span>Book Consultation</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Trust and Compliance Highlights */}
            <div className="p-6 rounded-[26px] bg-white/55 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-sm space-y-4">
              <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 mb-2">
                Clinical Standards & Privacy Commitments
              </h3>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7657ff]/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center shrink-0 border border-[#7657ff]/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">HIPAA-Compliant Transmission</h4>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    All submitted inquiries and attachments are safeguarded with end-to-end security protocols.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#7657ff]/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center shrink-0 border border-[#7657ff]/20">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">Human Care Coordination</h4>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                    Every message is evaluated by licensed clinical care coordinators, not generic ticketing algorithms.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive FAQs Accordion */}
            <div className="p-6 rounded-[26px] bg-white/55 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-sm">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">
                Frequently Asked Inquiries
              </h3>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/80 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:text-[#7657ff] dark:hover:text-[#a99aff] transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#7657ff]" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-white/5 pt-2.5">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column (7 Cols): Interactive Form or Success Confirmation */}
          <div className="lg:col-span-7">
            <div className="rounded-[32px] bg-white/70 dark:bg-white/[0.06] backdrop-blur-3xl border border-white/80 dark:border-white/15 p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] relative">
              
              {/* SUCCESS CONFIRMATION STATE */}
              {submittedTicket ? (
                <div className="text-center py-6 sm:py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                      INQUIRY SECURELY RECEIVED
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                      Thank You, {form.name.split(" ")[0]}!
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
                      Your transmission has been assigned to our on-duty patient coordinator team. An email confirmation has been prepared for <strong>{form.email}</strong>.
                    </p>
                  </div>

                  {/* Reference Ticket ID Badge */}
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/[0.08] border border-white/90 dark:border-white/15 max-w-md mx-auto shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-1">
                      Clinical Reference Ticket ID
                    </span>
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-mono text-base sm:text-lg font-bold text-[#7657ff] dark:text-[#a99aff] tracking-wider">
                        {submittedTicket.ticketId}
                      </span>
                      <button
                        type="button"
                        onClick={copyTicketId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-xs text-neutral-700 dark:text-neutral-300 font-medium transition-colors"
                        title="Copy Ticket ID"
                      >
                        {copiedTicket ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[11px] text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">
                      Estimated Response: <strong>{submittedTicket.expectedResponseTime}</strong>
                    </p>
                  </div>

                  {/* What happens next progression */}
                  <div className="max-w-md mx-auto text-left pt-2 border-t border-neutral-200/60 dark:border-white/10 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                      What to expect next:
                    </h4>
                    <div className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="w-5 h-5 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                      <span>Your inquiry is logged into our secure intake queue with ID <strong>{submittedTicket.ticketId}</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="w-5 h-5 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                      <span>An assigned clinical coordinator evaluates your request against doctor availability.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                      <span className="w-5 h-5 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                      <span>We will contact you via <strong>{form.preferredContactMethod.toUpperCase()}</strong> with next steps.</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-neutral-800 dark:text-neutral-200 text-xs font-semibold border border-white/80 dark:border-white/15 transition-colors cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                    <Link
                      href="/doctors"
                      className="px-5 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Explore Specialists
                    </Link>
                  </div>
                </div>
              ) : (
                /* INQUIRY SUBMISSION FORM */
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                      Send a Secure Message
                    </h2>
                    <p className="text-xs sm:text-[13px] text-neutral-600 dark:text-neutral-400 mt-1">
                      Fill out the form below and an assigned care coordinator will follow up promptly.
                    </p>
                  </div>

                  {/* Error Alert Banner */}
                  {submitError && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <strong>Submission Error:</strong> {submitError}
                      </div>
                    </div>
                  )}

                  {/* Department Chips Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                      Department or Area of Care
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {DEPARTMENTS.map((dept) => {
                        const isSelected = form.department === dept.id;
                        return (
                          <button
                            type="button"
                            key={dept.id}
                            onClick={() => setForm({ ...form, department: dept.id })}
                            className={`p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-[#7657ff]/10 dark:bg-[#7657ff]/20 border-[#7657ff] text-[#7657ff] dark:text-[#a99aff] ring-1 ring-[#7657ff]/40 shadow-xs"
                                : "bg-white/40 dark:bg-white/[0.04] border-white/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 text-neutral-800 dark:text-neutral-200"
                            }`}
                          >
                            <span className="text-xs font-bold block">{dept.label}</span>
                            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block mt-0.5 leading-snug">
                              {dept.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder="Dr. / Mr. / Ms. Jane Doe"
                        aria-invalid={!!errors.name}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.06] border text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/50 transition-colors ${
                          errors.name ? "border-rose-500" : "border-white/80 dark:border-white/15"
                        }`}
                      />
                      {errors.name && (
                        <p role="alert" className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="patient@example.com"
                        aria-invalid={!!errors.email}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.06] border text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/50 transition-colors ${
                          errors.email ? "border-rose-500" : "border-white/80 dark:border-white/15"
                        }`}
                      />
                      {errors.email && (
                        <p role="alert" className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Preferred Method */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Phone Number <span className="text-neutral-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => {
                          setForm({ ...form, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        placeholder="+1 (555) 000-0000"
                        aria-invalid={!!errors.phone}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.06] border text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/50 transition-colors ${
                          errors.phone ? "border-rose-500" : "border-white/80 dark:border-white/15"
                        }`}
                      />
                      {errors.phone && (
                        <p role="alert" className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Preferred Response Method
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["email", "phone", "sms"] as const).map((method) => {
                          const isSel = form.preferredContactMethod === method;
                          return (
                            <button
                              type="button"
                              key={method}
                              onClick={() => setForm({ ...form, preferredContactMethod: method })}
                              className={`py-2 px-2.5 rounded-xl text-center text-xs font-medium border uppercase tracking-wider transition-colors cursor-pointer ${
                                isSel
                                  ? "bg-[#7657ff] text-white border-[#7657ff] shadow-xs"
                                  : "bg-white/50 dark:bg-white/[0.05] border-white/80 dark:border-white/15 text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              {method}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Urgency Level Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-2">
                      Inquiry Priority / Urgency
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, urgency: "routine" })}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                          form.urgency === "routine"
                            ? "bg-purple-500/10 border-[#7657ff] text-[#7657ff] dark:text-[#a99aff] ring-1 ring-[#7657ff]/30 shadow-xs"
                            : "bg-white/40 dark:bg-white/[0.04] border-white/80 dark:border-white/10 text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">Standard Inquiries</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 font-semibold">
                            Within 24h
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                          General inquiries, insurance questions, records requests.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setForm({ ...form, urgency: "urgent" })}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                          form.urgency === "urgent"
                            ? "bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-200 ring-1 ring-amber-500/40 shadow-xs"
                            : "bg-white/40 dark:bg-white/[0.04] border-white/80 dark:border-white/10 text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">Urgent Consultation</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold">
                            Within 2h
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                          Expedited review for symptom changes or same-day scheduling.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) => {
                        setForm({ ...form, subject: e.target.value });
                        if (errors.subject) setErrors({ ...errors, subject: undefined });
                      }}
                      placeholder="e.g. Consultation request with Cardiology or EHR sync"
                      aria-invalid={!!errors.subject}
                      className={`w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.06] border text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/50 transition-colors ${
                        errors.subject ? "border-rose-500" : "border-white/80 dark:border-white/15"
                      }`}
                    />
                    {errors.subject && (
                      <p role="alert" className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Body */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="message" className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Detailed Message <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-neutral-400">
                        {form.message.length} / 2000 chars
                      </span>
                    </div>
                    <textarea
                      id="message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Please share details regarding your medical inquiry, relevant symptoms, preferred appointment times, or specific physician requirements..."
                      aria-invalid={!!errors.message}
                      className={`w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-white/[0.06] border text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/50 transition-colors resize-y ${
                        errors.message ? "border-rose-500" : "border-white/80 dark:border-white/15"
                      }`}
                    />
                    {errors.message && (
                      <p role="alert" className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* HIPAA Consent Checkbox */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => {
                          setForm({ ...form, consent: e.target.checked });
                          if (errors.consent) setErrors({ ...errors, consent: undefined });
                        }}
                        className="mt-0.5 w-4 h-4 rounded text-[#7657ff] focus:ring-[#7657ff] border-neutral-300 dark:border-white/20"
                      />
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        I acknowledge MedBridge Global&apos;s{" "}
                        <Link href="/privacy-policy" className="text-[#7657ff] dark:text-[#a99aff] underline underline-offset-2">
                          Privacy Policy
                        </Link>{" "}
                        and agree to receive secure HIPAA-compliant communications regarding this clinical inquiry.
                      </span>
                    </label>
                    {errors.consent && (
                      <p role="alert" className="text-[11px] text-rose-600 dark:text-rose-400 mt-1.5 font-medium">
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {/* Submit CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#7657ff]" />
                          <span>Transmitting Securely...</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit Secure Inquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-neutral-500 dark:text-neutral-400 mt-3 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>256-Bit SSL Encrypted & HIPAA Privacy Protected</span>
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Comprehensive Glass Footer */}
      <Footer />
    </main>
  );
}

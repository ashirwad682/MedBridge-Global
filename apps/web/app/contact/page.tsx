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
  Copy,
  Check,
  Calendar,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<ContactForm> = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      errs.name = "Please enter your name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!form.subject.trim() || form.subject.trim().length < 3) {
      errs.subject = "Please enter a subject (at least 3 characters).";
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      errs.message = "Please write a message with at least 10 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          department: "general",
          urgency: "routine",
          preferredContactMethod: "email",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message. Please try again.");
      }

      setTicketId(data.ticketId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicket = () => {
    if (!ticketId) return;
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setErrors({});
    setTicketId(null);
    setSubmitError(null);
  };

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      {/* Main Content Area */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        
        {/* Simple Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] block mb-2">
            GET IN TOUCH
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Contact MedBridge Global
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed">
            Have questions about our doctors, services, or need clinical support? Reach out and our team will assist you promptly.
          </p>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Cols): Direct Contact Information */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Contact Cards */}
            <div className="p-6 rounded-[26px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-2xs space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Direct Contact Channels
              </h2>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center shrink-0 border border-[#7657ff]/20">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Telephone Hotline</span>
                  <a
                    href="tel:+18004152273"
                    className="text-sm font-bold text-neutral-900 dark:text-white hover:text-[#7657ff] dark:hover:text-[#a99aff] transition-colors"
                  >
                    +1 (800) 415-CARE
                  </a>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Available 24/7 for patient inquiries
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center shrink-0 border border-[#7657ff]/20">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Direct Email</span>
                  <a
                    href="mailto:support@medbridgeglobal.care"
                    className="text-sm font-bold text-neutral-900 dark:text-white hover:text-[#7657ff] dark:hover:text-[#a99aff] transition-colors"
                  >
                    support@medbridgeglobal.care
                  </a>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Guaranteed response within 24 hours
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-[#7657ff] dark:text-[#a99aff] flex items-center justify-center shrink-0 border border-[#7657ff]/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Global Headquarters</span>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    MedBridge Clinical Center, Sector 62
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    New Delhi NCR, India & Synchronized Global Hubs
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3.5 pt-1 border-t border-neutral-200/50 dark:border-white/10">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-medium">Operating Hours</span>
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                    Emergency Triage: 24/7/365
                  </p>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    OPD & General Consultations: Mon - Sat, 8:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Consultation Shortcut Card */}
            <div className="p-5 sm:p-6 rounded-[26px] bg-gradient-to-br from-[#7657ff]/10 to-transparent dark:from-[#7657ff]/15 dark:to-transparent backdrop-blur-xl border border-[#7657ff]/20 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7657ff] dark:text-[#a99aff] block mb-1">
                FAST DIRECT BOOKING
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                Looking to schedule with a doctor?
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                Connect directly with board-certified physicians across 8 clinical specialties without waiting.
              </p>
              <div className="flex items-center gap-2.5">
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                >
                  <span>Find a Doctor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-neutral-800 dark:text-neutral-200 text-xs font-semibold border border-white/80 dark:border-white/15 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#7657ff]" />
                  <span>Book Visit</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column (7 Cols): Simple Responsive Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-[28px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-2xs">
              
              {ticketId ? (
                /* Success Feedback State */
                <div className="text-center py-6 sm:py-8 space-y-5">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                      MESSAGE TRANSMITTED
                    </span>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                      Thank You, {form.name}!
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                      Your inquiry has been registered in our database. Our clinical team will follow up at <strong>{form.email}</strong>.
                    </p>
                  </div>

                  {/* Reference Ticket Badge */}
                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 max-w-xs mx-auto flex items-center justify-between shadow-2xs">
                    <div className="text-left">
                      <span className="text-[10px] text-neutral-400 block uppercase font-bold tracking-wider">
                        Inquiry Reference ID
                      </span>
                      <span className="font-mono text-sm font-bold text-[#7657ff] dark:text-[#a99aff]">
                        {ticketId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={copyTicket}
                      className="p-2 rounded-lg bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-700 dark:text-neutral-300 transition-colors"
                      title="Copy Reference ID"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                /* Simple Fast Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Send a Message
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      We usually respond within a few hours. All fields marked with * are required.
                    </p>
                  </div>

                  {/* Submit Error Banner */}
                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
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
                        placeholder="John Doe"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-white/[0.06] border text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/40 transition-all ${
                          errors.name ? "border-rose-500" : "border-neutral-200/80 dark:border-white/12"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
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
                        placeholder="you@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-white/[0.06] border text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/40 transition-all ${
                          errors.email ? "border-rose-500" : "border-neutral-200/80 dark:border-white/12"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Phone Number <span className="text-neutral-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-white/[0.06] border border-neutral-200/80 dark:border-white/12 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/40 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
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
                        placeholder="e.g. Appointment Question"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-white/[0.06] border text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/40 transition-all ${
                          errors.subject ? "border-rose-500" : "border-neutral-200/80 dark:border-white/12"
                        }`}
                      />
                      {errors.subject && (
                        <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => {
                        setForm({ ...form, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Please describe how we can assist you..."
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white/70 dark:bg-white/[0.06] border text-xs sm:text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/40 transition-all resize-y ${
                        errors.message ? "border-rose-500" : "border-neutral-200/80 dark:border-white/12"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </section>

      <Footer />
    </main>
  );
}

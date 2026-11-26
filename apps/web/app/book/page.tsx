"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppointmentBookingForm from "@/components/booking/AppointmentBookingForm";
import { ShieldCheck, Calendar, Clock, Sparkles } from "lucide-react";

function BookingContent() {
  const searchParams = useSearchParams();
  const specialtyParam = searchParams.get("specialty") || undefined;
  const doctorParam = searchParams.get("doctor") || undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Context & Guarantees */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-500 block mb-2">
            MEDBRIDGE GLOBAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#080808] leading-tight mb-4">
            Schedule a Medical Consultation
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Reserve your consultation with top board-certified physicians across 8 medical disciplines. Fast confirmations and coordinated records.
          </p>
        </div>

        <div className="p-6 rounded-[24px] bg-white/55 dark:bg-white/[0.05] backdrop-blur-xl border border-white/80 dark:border-white/12 space-y-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#7657ff] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Synchronized Clinical Records</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">Your consultation notes and lab diagnostics are organized under a single private profile.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#7657ff] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Zero Wait Time Guarantee</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">Specialists adhere strictly to scheduled slots with dedicated unhurried visit times.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#7657ff] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">No Hidden Fees</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">Transparent consultation fees with comprehensive insurance eligibility verification.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Booking Form */}
      <div className="lg:col-span-7">
        <div className="bg-white/70 dark:bg-white/[0.06] backdrop-blur-3xl rounded-[32px] p-6 sm:p-8 border border-white/80 dark:border-white/12 shadow-xl">
          <AppointmentBookingForm
            initialSpecialtyId={specialtyParam}
            initialDoctorId={doctorParam}
          />
        </div>
      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      <section className="pt-28 sm:pt-36 pb-16 md:pb-24 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="py-20 text-center text-sm text-neutral-500">Loading booking form...</div>}>
            <BookingContent />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}


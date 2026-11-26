"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Search, ShieldCheck, Clock } from "lucide-react";
import { useBooking } from "@/components/booking/BookingContext";

export default function AppointmentCTASection() {
  const { openBooking } = useBooking();

  return (
    <section id="appointment" className="w-full py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[30px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden border border-white/80 dark:border-white/12 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] bg-white/55 dark:bg-white/[0.04] backdrop-blur-3xl relative">
          
          {/* Subtle light reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent dark:from-white/[0.03] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content Side */}
            <div className="lg:col-span-7 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/[0.08] backdrop-blur-md border border-white/80 dark:border-white/15 text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-800 dark:text-neutral-200 w-fit mb-5 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#7657ff] dark:text-[#a99aff]" />
                <span>DIRECT ACCESS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-4">
                Your Health Deserves<br />Expert Attention.
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg mb-8">
                Connect directly with board-certified physicians, review clinical reports, and receive continuous follow-up care in one synchronized platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 mb-8">
                <button
                  type="button"
                  onClick={() => openBooking()}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold tracking-wider uppercase transition-all shadow-[0_8px_24px_-4px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_24px_-4px_rgba(255,255,255,0.2)] active:scale-[0.98] cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>BOOK AN APPOINTMENT</span>
                </button>

                <Link
                  href="/doctors"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-neutral-900 dark:text-white border border-white/80 dark:border-white/15 text-xs font-semibold tracking-wider uppercase transition-all backdrop-blur-md shadow-xs"
                >
                  <Search className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  <span>FIND A SPECIALIST</span>
                </Link>
              </div>

              {/* Feature Badges */}
              <div className="pt-5 border-t border-neutral-200/60 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0" />
                  <span>HIPAA-Compliant & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#7657ff] dark:text-[#a99aff] shrink-0" />
                  <span>Same-Week In-Person & Virtual</span>
                </div>
              </div>
            </div>

            {/* Right Doctor Image */}
            <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-[480px] w-full overflow-hidden">
              <Image
                src="/images/cta-board-certified-doctor.jpg"
                alt="Board-certified Indian specialist physician ready for consultation"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center lg:object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

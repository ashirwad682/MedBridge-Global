"use client";

import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  HeartPulse,
  Activity,
  Bone,
  Brain,
  Sparkles,
  Baby,
  Scan,
  LucideIcon,
  ChevronRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { useBooking } from "@/components/booking/BookingContext";

// Map icon name string to Lucide component
const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  HeartPulse,
  Activity,
  Bone,
  Brain,
  Sparkles,
  Baby,
  Scan,
};

export default function SpecialtiesSection() {
  const { openBooking } = useBooking();

  return (
    <section id="specialties" className="w-full py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] mb-2 block">
              CLINICAL EXCELLENCE
            </span>
            <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.08] mb-3">
              Expert care across<br />every major specialty
            </h2>
            <p className="text-[13px] sm:text-[14px] text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg">
              Access experienced medical professionals across a broad range of disciplines through a connected healthcare experience.
            </p>
          </div>

          {/* Action buttons on the right */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openBooking()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 shadow-sm cursor-pointer active:scale-95"
            >
              BOOK APPOINTMENT
            </button>
            <Link
              href="/doctors"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-neutral-900 dark:text-white border border-white/80 dark:border-white/15 text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 backdrop-blur-md shadow-xs"
            >
              FIND A DOCTOR
            </Link>
          </div>
        </div>

        {/* 4-column desktop grid with Minimal Glass Squircles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {SITE_CONFIG.specialties.map((spec) => {
            const Icon = iconMap[spec.iconName] || Stethoscope;
            return (
              <Link
                key={spec.id}
                href={spec.href}
                className="group relative flex items-center justify-between p-4 sm:p-5 rounded-[22px] bg-white/55 dark:bg-white/[0.05] hover:bg-white/80 dark:hover:bg-white/[0.09] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-md transition-all duration-300 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  {/* Squircle App-style Icon Container from Reference */}
                  <div className="w-11 h-11 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/90 dark:border-white/15 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-[#7657ff]/40 transition-all duration-200 text-[#7657ff] dark:text-[#a99aff]">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h3 className="text-[14px] sm:text-[15px] font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {spec.name}
                    </h3>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

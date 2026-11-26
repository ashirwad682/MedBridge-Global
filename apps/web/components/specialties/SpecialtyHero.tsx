"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, Users } from "lucide-react";
import { SpecialtyData } from "@/lib/medical-data";
import { useBooking } from "@/components/booking/BookingContext";

interface SpecialtyHeroProps {
  specialty: SpecialtyData;
}

export default function SpecialtyHero({ specialty }: SpecialtyHeroProps) {
  const { openBooking } = useBooking();

  return (
    <section className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 bg-[#FAFAF9] border-b border-neutral-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-neutral-500 mb-8"
        >
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <Link href="/#specialties" className="hover:text-black transition-colors">
            Specialties
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-900 font-medium">{specialty.name}</span>
        </nav>

        {/* Hero Split Layout: Left Content (45%), Right Visual Image (55%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: Crisp, Minimal Text & CTAs */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
            {/* Small specialty label */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-neutral-900" />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-700">
                {specialty.label}
              </span>
            </div>

            {/* Large specialty heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-[#080808] leading-[1.08] mb-4">
              {specialty.name}
            </h1>

            {/* One short introductory sentence */}
            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mb-8 max-w-lg">
              {specialty.shortIntro}
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openBooking({ specialtyId: specialty.id })}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#050505] text-white text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>BOOK CONSULTATION</span>
              </button>

              <a
                href="#specialists"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-neutral-50 text-[#080808] border border-neutral-300 text-xs font-semibold tracking-wider uppercase transition-all shadow-xs"
              >
                <Users className="w-3.5 h-3.5 text-neutral-600" />
                <span>VIEW SPECIALISTS</span>
              </a>
            </div>
          </div>

          {/* Right Side: Editorial Photography with Soft Rounded Frame */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] border border-white/80 bg-neutral-100">
              <Image
                src={specialty.heroImage}
                alt={specialty.heroAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center"
              />
              {/* Subtle ambient light gradient at bottom edge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


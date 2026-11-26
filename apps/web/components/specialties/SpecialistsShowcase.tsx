"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Doctor } from "@/lib/medical-data";
import DoctorCard from "@/components/doctors/DoctorCard";

interface SpecialistsShowcaseProps {
  specialtyName: string;
  doctors: Doctor[];
}

export default function SpecialistsShowcase({
  specialtyName,
  doctors,
}: SpecialistsShowcaseProps) {
  return (
    <section id="specialists" className="w-full py-16 md:py-24 bg-white border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-500 block mb-2">
              VERIFIED MEDICAL TEAM
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold tracking-tight text-[#080808]">
              Meet Our Specialists
            </h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-lg">
              Experienced professionals committed to exceptional patient care.
            </p>
          </div>

          <Link
            href="/doctors"
            className="text-xs font-semibold tracking-wider uppercase text-neutral-800 hover:text-black inline-flex items-center gap-1.5 underline underline-offset-4"
          >
            All MedBridge Doctors <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 or 4 Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}


"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Doctor } from "@/lib/medical-data";
import { Star, Calendar, ArrowRight, Award, Clock } from "lucide-react";
import { useBooking } from "@/components/booking/BookingContext";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const { openBooking } = useBooking();

  return (
    <div className="group rounded-[26px] bg-white/55 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-xl hover:border-white dark:hover:border-white/20 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Photo & Badge */}
      <Link
        href={`/doctors/${doctor.id}`}
        className="relative w-full aspect-square bg-neutral-100 dark:bg-white/5 overflow-hidden block cursor-pointer"
        aria-label={`View profile and schedule with ${doctor.name}`}
      >
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 border border-white/80 dark:border-white/15 shadow-xs">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{doctor.rating}</span>
            <span className="text-neutral-400 font-normal">({doctor.reviewsCount})</span>
          </span>
        </div>
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/65 dark:bg-white/15 backdrop-blur-md text-[11px] font-medium text-white border border-white/20 shadow-xs">
            <Clock className="w-3 h-3 text-neutral-300" />
            <span>{doctor.experienceYears} yrs exp</span>
          </span>
        </div>
      </Link>

      {/* Doctor Info */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <span className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-[#7657ff] dark:text-[#a99aff] mb-1">
            {doctor.specialtyName}
          </span>
          <Link href={`/doctors/${doctor.id}`} className="group/name block cursor-pointer">
            <h3 className="text-[17px] sm:text-[18px] font-bold text-neutral-900 dark:text-white leading-snug group-hover/name:text-[#7657ff] dark:group-hover/name:text-[#a99aff] transition-colors">
              {doctor.name}
            </h3>
          </Link>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 font-medium line-clamp-1">
            {doctor.title}
          </p>

          {/* Key Qualifications */}
          <div className="mt-3.5 pt-3.5 border-t border-neutral-200/50 dark:border-white/10 flex items-start gap-2">
            <Award className="w-3.5 h-3.5 text-[#7657ff] dark:text-[#a99aff] shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
              {doctor.qualifications.join(" • ")}
            </p>
          </div>

          {/* Availability */}
          <div className="mt-2.5 flex items-center gap-2 text-[11.5px] text-neutral-500 dark:text-neutral-400">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{doctor.availability}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-5 pt-4 border-t border-neutral-200/50 dark:border-white/10 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() =>
              openBooking({
                specialtyId: doctor.specialtyId,
                doctorId: doctor.id,
              })
            }
            className="flex-1 py-2.5 px-3 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold tracking-wider uppercase transition-all text-center shadow-xs cursor-pointer active:scale-95"
          >
            Book Visit
          </button>
          <Link
            href={`/doctors/${doctor.id}`}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-white/20 transition-all"
            aria-label={`View full profile of ${doctor.name}`}
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

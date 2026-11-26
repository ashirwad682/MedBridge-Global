"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SpecialtyCondition } from "@/lib/medical-data";
import { useBooking } from "@/components/booking/BookingContext";

interface ConditionsSectionProps {
  specialtyId: string;
  subtitle: string;
  conditions: SpecialtyCondition[];
}

export default function ConditionsSection({
  specialtyId,
  subtitle,
  conditions,
}: ConditionsSectionProps) {
  const { openBooking } = useBooking();

  return (
    <section className="w-full py-16 md:py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-10 md:mb-12">
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-500 block mb-2">
            AREAS OF CARE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#080808]">
            Conditions We Help Manage
          </h2>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 3-Column Balanced Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {conditions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => openBooking({ specialtyId })}
              className="group relative flex flex-col justify-between p-5 rounded-[22px] bg-[#FAFAFA] hover:bg-white border border-neutral-200/70 hover:border-neutral-300 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.07)] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div>
                {/* Visual Thumbnail & Arrow Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-500 group-hover:text-black group-hover:bg-neutral-100 transition-colors shadow-2xs">
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Condition Name */}
                <h3 className="text-base font-semibold text-[#080808] leading-snug group-hover:text-black transition-colors mb-1.5">
                  {item.name}
                </h3>

                {/* One short description */}
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              {/* Consultation Tag */}
              <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[11px] font-medium text-neutral-500 group-hover:text-neutral-800 transition-colors">
                <span>Specialist Consultation</span>
                <span className="font-semibold text-neutral-900 underline underline-offset-2">Book Visit</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


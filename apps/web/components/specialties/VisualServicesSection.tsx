"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SpecialtyService } from "@/lib/medical-data";
import { useBooking } from "@/components/booking/BookingContext";

interface VisualServicesSectionProps {
  specialtyId: string;
  specialtyName: string;
  services: SpecialtyService[];
}

export default function VisualServicesSection({
  specialtyId,
  specialtyName,
  services,
}: VisualServicesSectionProps) {
  const { openBooking } = useBooking();

  return (
    <section className="w-full py-16 md:py-20 bg-[#F9F9F8] border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-neutral-500 block mb-2">
            CLINICAL CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold tracking-tight text-[#080808]">
            Consultation & Diagnostic Services
          </h2>
          <p className="text-sm text-neutral-600 mt-2">
            Modern outpatient evaluations, diagnostic testing, and coordinated treatment protocols.
          </p>
        </div>

        {/* 2-Column Clean Image-Based Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group rounded-[24px] bg-white border border-neutral-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)] hover:border-neutral-300 transition-all duration-300 flex flex-col sm:flex-row overflow-hidden"
            >
              {/* Image occupying ~45-50% */}
              <div className="relative w-full sm:w-[48%] min-h-[200px] sm:min-h-full bg-neutral-100 overflow-hidden shrink-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Text content occupying remainder */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div>
                  <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-neutral-400 mb-2">
                    Service 0{idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-[#080808] leading-snug mb-2 group-hover:text-black transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => openBooking({ specialtyId })}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-900 group-hover:text-black hover:underline underline-offset-4 cursor-pointer"
                  >
                    <span>Request Service</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


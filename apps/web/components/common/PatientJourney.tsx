import React from "react";
import { UserCheck, CalendarCheck, ShieldCheck } from "lucide-react";

export default function PatientJourney() {
  const steps = [
    {
      number: "01",
      title: "Find Your Specialist",
      description: "Choose the right medical professional tailored to your clinical needs.",
      icon: UserCheck,
    },
    {
      number: "02",
      title: "Book Your Consultation",
      description: "Select a convenient in-person or virtual consultation appointment.",
      icon: CalendarCheck,
    },
    {
      number: "03",
      title: "Receive Coordinated Care",
      description: "Stay connected throughout your treatment journey with synchronized records.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-[#FAFAF9] border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14 md:mb-16">
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-neutral-500 block mb-2">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold tracking-tight text-[#080808]">
            Your Healthcare Journey, Simplified
          </h2>
          <p className="text-sm text-neutral-600 mt-2.5">
            Empathetic healthcare coordination designed around clarity and direct specialist access.
          </p>
        </div>

        {/* 3 Balanced Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-[24px] bg-white p-7 sm:p-8 border border-neutral-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.06)] hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Large Numeral & Icon Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-4xl sm:text-5xl font-light text-neutral-300 font-mono tracking-tighter">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-center text-neutral-800">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#080808] mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center text-[11px] font-semibold tracking-wider uppercase text-neutral-400">
                  <span>Step {step.number} of 03</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


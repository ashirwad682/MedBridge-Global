import React from "react";
import { SITE_CONFIG } from "@/lib/site-config";
import { CheckCircle2 } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section id="about" className="w-full py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] mb-2 block">
              SEAMLESS COORDINATION
            </span>
            <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-bold tracking-tight text-neutral-900 dark:text-white">
              How Connected Care Operates
            </h2>
          </div>
          <p className="text-[13px] sm:text-[14px] text-neutral-600 dark:text-neutral-400 max-w-md">
            A three-step continuum designed to guide you from initial inquiry to structured long-term health resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SITE_CONFIG.journey.map((step) => (
            <div
              key={step.step}
              className="relative p-8 rounded-[26px] bg-white/55 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg"
            >
              <div>
                <span className="text-[32px] font-light text-[#7657ff] dark:text-[#a99aff] block mb-6 font-mono">
                  {step.step}
                </span>
                <h3 className="text-[18px] font-semibold text-neutral-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-200/50 dark:border-white/10 flex items-center gap-2 text-neutral-700 dark:text-neutral-300 text-[12px] font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified clinical milestone</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

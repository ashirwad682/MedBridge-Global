"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartHandshake,
  Network,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  X,
  FileText,
} from "lucide-react";
import { useBooking } from "@/components/booking/BookingContext";
import { DOCTORS_DATA } from "@/lib/medical-data";
import PatientTestimonialsCarousel from "@/components/testimonials/PatientTestimonialsCarousel";

interface BenefitCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  actionLabel: string;
}

const BENEFIT_CARDS: BenefitCard[] = [
  {
    id: "unified-ecosystem",
    badge: "COORDINATED CARE",
    title: "Unified Care Ecosystem",
    description: "Your specialists and care teams stay connected throughout your healthcare journey.",
    image: "/images/unified-care-team.jpg",
    alt: "Multidisciplinary Indian medical team collaborating on patient treatment in a modern hospital consultation",
    actionLabel: "View How It Works",
  },
  {
    id: "specialist-access",
    badge: "EXPERT ACCESS",
    title: "Direct Specialist Access",
    description: "Find the right specialist and take the next step toward expert care.",
    image: "/images/specialist-consultation.jpg",
    alt: "Professional Indian specialist doctor in a white coat consulting with patient",
    actionLabel: "Explore Doctors",
  },
  {
    id: "digital-first",
    badge: "DIGITAL HEALTHCARE",
    title: "Transparent & Digital First",
    description: "Access your healthcare information and stay informed throughout your care journey.",
    image: "/images/digital-healthcare.jpg",
    alt: "Indian doctor using laptop reviewing digital electronic health records and diagnostic dashboard",
    actionLabel: "Explore Patient Experience",
  },
  {
    id: "patient-followup",
    badge: "CONTINUOUS SUPPORT",
    title: "Patient-Centered Follow-up",
    description: "Stay connected with your care team beyond your consultation.",
    image: "/images/patient-follow-up.jpg",
    alt: "Indian doctor interacting warmly with patient explaining recovery progress in modern clinic",
    actionLabel: "Learn About Follow-up",
  },
];

export default function BenefitsSection() {
  const { openBooking } = useBooking();
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const spotlightDoctors = DOCTORS_DATA.slice(0, 3);

  const togglePanel = (panelId: string) => {
    setActivePanel((prev) => (prev === panelId ? null : panelId));
  };

  return (
    <section id="about" className="w-full py-16 md:py-24 relative overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      {/* Compatibility anchor for any legacy #why-us references */}
      <span id="why-us" className="sr-only" aria-hidden="true" />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header with Trust Indicators */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#7657ff] dark:text-[#a99aff] mb-2.5 block">
            ABOUT MEDBRIDGE GLOBAL
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Why Patients Choose MedBridge Global
          </h2>
          <p className="text-sm sm:text-[15px] text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed max-w-xl mx-auto font-normal">
            Connected specialists, coordinated care, and a healthcare experience built around you.
          </p>

          {/* Trust Indicators Bar Below Subtitle */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/[0.07] backdrop-blur-md border border-white/80 dark:border-white/12 text-neutral-700 dark:text-neutral-300 shadow-2xs">
              <HeartHandshake className="w-3.5 h-3.5 text-[#7657ff] dark:text-[#a99aff]" />
              <span>Patient-First Approach</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/[0.07] backdrop-blur-md border border-white/80 dark:border-white/12 text-neutral-700 dark:text-neutral-300 shadow-2xs">
              <Network className="w-3.5 h-3.5 text-[#7657ff] dark:text-[#a99aff]" />
              <span>Coordinated Healthcare</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-white/[0.07] backdrop-blur-md border border-white/80 dark:border-white/12 text-neutral-700 dark:text-neutral-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7657ff] dark:text-[#a99aff]" />
              <span>Transparent Communication</span>
            </div>
          </div>
        </div>

        {/* 2. Four Interactive Glassmorphic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFIT_CARDS.map((card) => {
            const isSelected = activePanel === card.id;
            return (
              <div
                key={card.id}
                onClick={() => togglePanel(card.id)}
                className={`group rounded-[26px] bg-white/55 dark:bg-white/[0.05] backdrop-blur-2xl border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer ${
                  isSelected
                    ? "border-[#7657ff] dark:border-[#8b6dff] ring-2 ring-[#7657ff]/30 shadow-[0_20px_50px_-10px_rgba(118,87,255,0.2)]"
                    : "border-white/80 dark:border-white/12 hover:border-white dark:hover:border-white/25 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-lg"
                }`}
              >
                {/* Card Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-white/5">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Active Indicator Tag */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#7657ff] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                      Active View
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="inline-block text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] mb-2">
                      {card.badge}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 leading-snug group-hover:text-black dark:group-hover:text-neutral-100 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  {/* Action CTA Button */}
                  <div className="mt-5 pt-4 border-t border-neutral-200/60 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white">
                    <span className="group-hover:underline underline-offset-4">
                      {card.actionLabel}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 group-hover:bg-[#0a0a0a] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black flex items-center justify-center transition-all duration-200">
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Interactive Detail Panels (Frosted Glass Accordion) */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden mt-6"
            >
              <div className="relative rounded-[26px] bg-white/70 dark:bg-[#121624]/80 backdrop-blur-2xl border border-white/80 dark:border-white/15 p-6 sm:p-8 md:p-10 shadow-2xl">
                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-white/80 dark:border-white/15 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Close interactive panel"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Panel 1: How Coordinated Care Works */}
                {activePanel === "unified-ecosystem" && (
                  <div>
                    <div className="max-w-xl mb-6">
                      <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1">
                        CLINICAL ARCHITECTURE
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                        How Unified Coordinated Care Operates
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Fragmented healthcare wastes patient time. MedBridge synchronizes your clinical journey across 3 connected pillars.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                      <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/[0.05] border border-white/80 dark:border-white/10 shadow-2xs">
                        <div className="w-8 h-8 rounded-full bg-[#7657ff] text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs">
                          1
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Primary Intake & History</h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          Your medical records, previous lab tests, and health metrics are centralized into one secure clinical file.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/[0.05] border border-white/80 dark:border-white/10 shadow-2xs">
                        <div className="w-8 h-8 rounded-full bg-[#7657ff] text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs">
                          2
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Specialist Multi-Review</h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          Attending specialists confer directly with diagnostics and primary physicians before prescribing treatment.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/[0.05] border border-white/80 dark:border-white/10 shadow-2xs">
                        <div className="w-8 h-8 rounded-full bg-[#7657ff] text-white flex items-center justify-center text-xs font-bold mb-3 shadow-xs">
                          3
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Unified Action Plan</h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          You receive one transparent care roadmap with clear prescriptions, diagnostic timelines, and zero repeated tests.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href="/#specialties"
                        onClick={() => setActivePanel(null)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                      >
                        Explore Specialties <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Panel 2: Direct Specialist Access & Featured Doctors */}
                {activePanel === "specialist-access" && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                      <div>
                        <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1">
                          DIRECT ACCESS DIRECTORY
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                          Connect with Verified Specialists
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          Skip weeks of administrative referral delays. Book direct outpatient consultations.
                        </p>
                      </div>
                      <Link
                        href="/doctors"
                        className="text-xs font-semibold text-[#7657ff] dark:text-[#a99aff] underline underline-offset-4 hover:opacity-80"
                      >
                        Browse All Physicians →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {spotlightDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.06] border border-white/80 dark:border-white/12 shadow-2xs flex items-center gap-3.5"
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                            <Image
                              src={doc.image}
                              alt={doc.name}
                              fill
                              sizes="48px"
                              className="object-cover object-top"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7657ff] dark:text-[#a99aff] block truncate">
                              {doc.specialtyName}
                            </span>
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                              {doc.name}
                            </h4>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                              {doc.experienceYears}y exp • {doc.availability.split("(")[0]}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActivePanel(null);
                              openBooking({ specialtyId: doc.specialtyId, doctorId: doc.id });
                            }}
                            className="px-3 py-1.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-[11px] font-semibold tracking-wider uppercase transition-colors shrink-0 cursor-pointer shadow-xs"
                          >
                            Book
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Panel 3: Transparent & Digital First Preview */}
                {activePanel === "digital-first" && (
                  <div>
                    <div className="max-w-xl mb-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 text-neutral-800 dark:text-neutral-200 text-[10.5px] font-semibold mb-2 shadow-2xs">
                        <FileText className="w-3.5 h-3.5 text-[#7657ff]" />
                        <span>Interactive Patient Experience Preview</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                        Synchronized Digital Records & Timelines
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Patients enjoy instant private lookup of diagnostic summaries, past consultations, and care coordinator notes.
                      </p>
                    </div>

                    <div className="bg-white/60 dark:bg-white/[0.06] rounded-2xl p-5 border border-white/80 dark:border-white/12 shadow-2xs mb-6">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-white/10 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-900 dark:text-white">MBG-2026-8812</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[10px] uppercase border border-emerald-200/50 dark:border-emerald-800/40">
                            Confirmed
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 italic">Sample demonstrative record</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs">
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Specialist</span>
                          <strong className="text-neutral-900 dark:text-white">Dr. Marcus Chen, MD, FACC</strong>
                        </div>
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Department</span>
                          <strong className="text-neutral-900 dark:text-white">Cardiology & Vascular</strong>
                        </div>
                        <div>
                          <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Reports Attached</span>
                          <strong className="text-neutral-900 dark:text-white">Echocardiogram & Lipid Panel</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href="/appointments"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                      >
                        Access Patient Portal <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Panel 4: Patient-Centered Follow-up Continuum */}
                {activePanel === "patient-followup" && (
                  <div>
                    <div className="max-w-xl mb-6">
                      <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1">
                        POST-VISIT CONTINUUM
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                        Care That Extends Beyond Your Consultation
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Recovery is a milestone journey. Dedicated coordinators stay in touch to track progress and verify healing.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.05] border border-white/80 dark:border-white/10 shadow-2xs">
                        <span className="text-xs font-bold text-[#7657ff] dark:text-[#a99aff] block mb-1 font-mono">STAGE 01</span>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-1">Outpatient Visit</h4>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          In-depth clinical consultation, biometric diagnostics, and personalized care roadmap.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.05] border border-white/80 dark:border-white/10 shadow-2xs">
                        <span className="text-xs font-bold text-[#7657ff] dark:text-[#a99aff] block mb-1 font-mono">STAGE 02</span>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-1">72-Hour Check-in</h4>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          Digital care review assessing medication tolerance, questions, and immediate recovery.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.05] border border-white/80 dark:border-white/10 shadow-2xs">
                        <span className="text-xs font-bold text-[#7657ff] dark:text-[#a99aff] block mb-1 font-mono">STAGE 03</span>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-1">14-Day Milestone</h4>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          Progress confirmation and follow-up lab or imaging review with your attending physician.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.05] border border-white/80 dark:border-white/10 shadow-2xs">
                        <span className="text-xs font-bold text-[#7657ff] dark:text-[#a99aff] block mb-1 font-mono">STAGE 04</span>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-1">Wellness Continuity</h4>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          Ongoing preventive screening alerts and lifestyle coaching for long-term health.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePanel(null);
                          openBooking();
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                      >
                        Schedule Your Visit <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 6. Real Patient Experiences ("Real Experiences. Better Care.") Animated Carousel */}
        <div className="mt-16 md:mt-24 pt-14 border-t border-neutral-200/60 dark:border-white/10">
          <PatientTestimonialsCarousel />
        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, ShieldCheck, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard, { PatientReview } from "./ReviewCard";

export const PATIENT_REVIEWS_DATA: PatientReview[] = [
  {
    id: 1,
    headline: "Echo reports and care plan ready within 24 hours.",
    name: "Ananya R.",
    location: "Bangalore",
    initials: "AR",
    department: "Cardiology",
    consultationType: "Cardiac Evaluation & 2D Echo",
    rating: 5.0,
    quote:
      "The coordination between my cardiologist and the diagnostic team was exceptional. My echo reports and medication plan were ready within 24 hours without repeating tests.",
    shortQuote:
      "Echo reports and care plan were ready within 24 hours without repeating tests. Exceptional cardiology coordination.",
    highlight: "Zero redundant tests • 24-hr turnaround",
    dateBadge: "Verified Visit",
    isVerified: true,
    hospitalAffiliation: "Apollo Hospital Network",
  },
  {
    id: 2,
    headline: "Unhurried consultation with a clear non-surgical plan.",
    name: "Vikram S.",
    location: "Mumbai",
    initials: "VS",
    department: "Orthopedics & Spine",
    consultationType: "Spine Consultation & Joint Rehab",
    rating: 5.0,
    quote:
      "Consulting with my specialist was completely unhurried. He explained my MRI scans in plain terms and provided a non-surgical joint rehabilitation plan that worked.",
    shortQuote:
      "Unhurried consultation with a clear non-surgical plan. He explained my MRI scans in plain terms that worked.",
    highlight: "Clear MRI review • Non-surgical plan",
    dateBadge: "Verified Visit",
    isVerified: true,
    hospitalAffiliation: "Fortis Healthcare Network",
  },
  {
    id: 3,
    headline: "Synchronized records gave our family complete peace of mind.",
    name: "Meera K.",
    location: "New Delhi",
    initials: "MK",
    department: "Internal Medicine",
    consultationType: "Comprehensive Metabolic Workup",
    rating: 5.0,
    quote:
      "Having all my lab records and follow-ups coordinated under one profile gave my family total peace of mind. The care team genuinely listened to every symptom.",
    shortQuote:
      "Synchronized records gave our family complete peace of mind. The care team genuinely listened to every symptom.",
    highlight: "Synchronized profile • Empathetic listening",
    dateBadge: "Verified Visit",
    isVerified: true,
    hospitalAffiliation: "Max Healthcare Network",
  },
  {
    id: 4,
    headline: "Systematic diagnosis with proactive 48-hour follow-up.",
    name: "Dev K.",
    location: "Hyderabad",
    initials: "DK",
    department: "Neurology",
    consultationType: "Migraine & Neuro-Vascular Follow-Up",
    rating: 5.0,
    quote:
      "My neurologist systematically ruled out acute triggers and adjusted my preventative regimen. The care coordinator followed up 48 hours later to check my response.",
    shortQuote:
      "Systematic diagnosis with proactive follow-up. My neurologist ruled out acute triggers and adjusted my regimen with care.",
    highlight: "Systematic diagnosis • 48-hr coordinator check",
    dateBadge: "Verified Visit",
    isVerified: true,
    hospitalAffiliation: "Manipal Hospital Network",
  },
  {
    id: 5,
    headline: "Targeted clinical therapy with visible progress in 3 weeks.",
    name: "Sneha T.",
    location: "Pune",
    initials: "ST",
    department: "Dermatology",
    consultationType: "Clinical Dermatology & Targeted Care",
    rating: 5.0,
    quote:
      "Dr. Agarwal took the time to review my full history before prescribing targeted therapies. My condition showed noticeable, healthy improvement in three weeks.",
    shortQuote:
      "Reviewed my full history before prescribing targeted therapies. My condition showed noticeable, healthy improvement in three weeks.",
    highlight: "Personalized therapy • Visible progress",
    dateBadge: "Verified Visit",
    isVerified: true,
    hospitalAffiliation: "MedBridge Specialized Clinic",
  },
  {
    id: 6,
    headline: "Effortless booking with zero waiting room delays.",
    name: "Rohit P.",
    location: "Chennai",
    initials: "RP",
    department: "Family Medicine",
    consultationType: "Preventative Health Intake & Review",
    rating: 5.0,
    quote:
      "Booking an appointment was effortless. Our primary physician reviewed both my preventive blood panels and lifestyle goals with total clarity and zero rush.",
    shortQuote:
      "Effortless booking with zero waiting delays. Our primary physician reviewed both panels and lifestyle goals clearly.",
    highlight: "Zero waiting delays • Clear preventative advice",
    dateBadge: "Verified Visit",
    isVerified: true,
    hospitalAffiliation: "Apollo Primary Network",
  },
  {
    id: 7,
    headline: "Gentle, observant pediatric care that comforted my child.",
    name: "Pooja L.",
    location: "Gurgaon",
    initials: "PL",
    department: "Pediatrics",
    consultationType: "Pediatric Developmental Assessment",
    rating: 5.0,
    quote:
      "The pediatric team made my daughter feel calm immediately. The physician was gentle, observant, and gave us an actionable, practical dietary management plan.",
    shortQuote:
      "The pediatric team made my daughter feel calm immediately. Observant, gentle care with an actionable dietary plan.",
    highlight: "Gentle pediatric care • Actionable plan",
    dateBadge: "Verified Parent Review",
    isVerified: true,
    hospitalAffiliation: "Rainbow Children's Network",
  },
  {
    id: 8,
    headline: "Digital scans shared directly with my specialist before I left.",
    name: "Naveen J.",
    location: "Kolkata",
    initials: "NJ",
    department: "Diagnostic Imaging",
    consultationType: "High-Resolution MRI & Radiologist Review",
    rating: 5.0,
    quote:
      "The imaging center was prompt, courteous, and modern. My digital scans were shared directly with my orthopedist before I even left the clinic premises.",
    shortQuote:
      "Prompt, courteous, and exceptionally modern imaging. Digital scans were shared with my specialist before I left.",
    highlight: "Instant digital sharing • Modern imaging suite",
    dateBadge: "Verified Visit",
    isVerified: true,
    hospitalAffiliation: "MedBridge Advanced Diagnostics",
  },
];

export default function PatientTestimonialsCarousel() {
  const reviews = PATIENT_REVIEWS_DATA;
  const total = reviews.length;

  // Active focal review index (0 to total - 1)
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

  // Responsive visible cards count: 1 (mobile), 2 (tablet), 3 (desktop)
  const [visibleCount, setVisibleCount] = useState(3);

  // Track touch gestures for mobile swipe
  const touchStartXRef = useRef<number | null>(null);

  // Update visible count based on screen width
  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setSlideDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setSlideDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-advance every 5.5 seconds unless paused or hovered
  useEffect(() => {
    if (isPaused || isHovered) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused, isHovered, handleNext]);

  // Calculate the currently displayed cards based on activeIndex and visibleCount
  const visibleReviews = Array.from({ length: visibleCount }, (_, i) => {
    const reviewIdx = (activeIndex + i) % total;
    return {
      review: reviews[reviewIdx],
      index: reviewIdx,
      isPrimary: i === 0, // The first card in the visible set is given the active spotlight
    };
  });

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      aria-label="Patient Reviews"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full relative"
    >
      {/* 1. Header: Clean Editorial Title + Supporting Sentence + Natural Metric & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7657FF]" />
            <span className="text-[12px] font-semibold tracking-[0.14em] uppercase text-neutral-500">
              Verified Experiences
            </span>
          </div>

          {/* Editorial Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.15] mb-3">
            Real Experiences. Better Care.
          </h2>

          {/* Single Short Supporting Sentence */}
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            Clinical excellence and compassionate care, reflected in the voices of our patients.
          </p>
        </div>

        {/* Header Right: Natural Statistic & Minimal Controls */}
        <div className="flex items-center gap-4 sm:gap-6 self-start lg:self-end shrink-0">
          {/* Naturally Integrated Metric */}
          <div className="hidden sm:flex items-center gap-2.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium pb-1">
            <div className="flex items-center gap-1 font-semibold text-neutral-900 dark:text-white">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9</span>
            </div>
            <span className="text-neutral-300 dark:text-neutral-600">•</span>
            <span>15,000+ verified consultations</span>
          </div>

          {/* Minimal Frosted Controls Pod */}
          <div className="flex items-center gap-2">
            {/* Auto-scroll Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-white/80 dark:border-white/15 transition-all cursor-pointer shadow-2xs backdrop-blur-md"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPaused ? "bg-amber-400" : "bg-[#7657FF] animate-pulse"
                }`}
              />
              {isPaused ? (
                <>
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span className="text-[11px]">Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-2.5 h-2.5 fill-current" />
                  <span className="text-[11px]">Auto</span>
                </>
              )}
            </button>

            {/* Circular Frosted Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous review"
                className="w-9 h-9 rounded-full bg-white/60 dark:bg-white/10 hover:bg-[#0a0a0a] hover:text-white dark:hover:bg-white dark:hover:text-black border border-white/80 dark:border-white/15 flex items-center justify-center text-neutral-700 dark:text-neutral-200 transition-colors shadow-2xs cursor-pointer active:scale-95 backdrop-blur-md"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2]" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next review"
                className="w-9 h-9 rounded-full bg-white/60 dark:bg-white/10 hover:bg-[#0a0a0a] hover:text-white dark:hover:bg-white dark:hover:text-black border border-white/80 dark:border-white/15 flex items-center justify-center text-neutral-700 dark:text-neutral-200 transition-colors shadow-2xs cursor-pointer active:scale-95 backdrop-blur-md"
              >
                <ChevronRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Reviews Grid: Displays 2-3 Reviews with Stronger Visual Prominence on Active */}
      <div className="w-full relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: slideDirection * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection * -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`grid gap-5 sm:gap-6 ${
              visibleCount === 1
                ? "grid-cols-1"
                : visibleCount === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {visibleReviews.map(({ review, index, isPrimary }) => (
              <ReviewCard
                key={`${review.id}-${index}`}
                review={review}
                isActive={isPrimary}
                onClick={() => {
                  setSlideDirection(index >= activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Minimal Bottom Pagination & Discreet Verification */}
      <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200/50 dark:border-white/10">
        {/* Minimal Progress Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200 tracking-tight">
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="text-neutral-300 dark:text-neutral-600 mx-1.5 font-normal">/</span>
            {String(total).padStart(2, "0")}
          </span>

          {/* Discreet Interactive Pagination Indicators */}
          <div
            className="flex items-center gap-1.5"
            role="tablist"
            aria-label="Review pagination"
          >
            {reviews.map((rev, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={rev.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Jump to review by ${rev.name}`}
                  onClick={() => {
                    setSlideDirection(idx >= activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isSelected
                      ? "w-6 h-1.5 bg-[#7657ff] dark:bg-[#8b6dff]"
                      : "w-1.5 h-1.5 bg-neutral-300 dark:bg-white/20 hover:bg-neutral-400 dark:hover:bg-white/40"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Discreet Legal & Verification Notice */}
        <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs font-normal">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
          <span>Curated from verified clinical survey records. Outcomes vary per individual.</span>
        </div>
      </div>
    </section>
  );
}

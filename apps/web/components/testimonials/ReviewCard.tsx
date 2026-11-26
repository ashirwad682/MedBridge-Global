"use client";

import React from "react";
import { Star, Check, ShieldCheck } from "lucide-react";

export interface PatientReview {
  id: number;
  headline: string;
  name: string;
  location: string;
  initials: string;
  department: string;
  consultationType: string;
  rating: number;
  quote: string;
  shortQuote?: string;
  highlight: string;
  dateBadge: string;
  isVerified: boolean;
  hospitalAffiliation: string;
}

interface ReviewCardProps {
  review: PatientReview;
  isActive?: boolean;
  onClick?: () => void;
}

export default function ReviewCard({
  review,
  isActive = false,
  onClick,
}: ReviewCardProps) {
  const reviewText = review.shortQuote || review.quote;

  return (
    <article
      onClick={onClick}
      className={`group relative h-full min-h-[300px] sm:min-h-[320px] rounded-[24px] p-7 sm:p-8 flex flex-col justify-between transition-all duration-500 ease-out cursor-pointer select-none overflow-hidden backdrop-blur-2xl ${
        isActive
          ? "bg-white/75 dark:bg-white/[0.08] border border-[#7657ff]/40 dark:border-[#8b6dff]/50 shadow-[0_24px_54px_-16px_rgba(118,87,255,0.15),inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] ring-1 ring-[#7657ff]/20 sm:scale-[1.02] z-10"
          : "bg-white/45 dark:bg-white/[0.04] border border-white/75 dark:border-white/10 hover:border-white dark:hover:border-white/20 hover:bg-white/65 dark:hover:bg-white/[0.06] shadow-[0_10px_30px_-10px_rgba(15,23,42,0.04),inset_0_1px_1px_rgba(255,255,255,0.85)] dark:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] opacity-85 hover:opacity-100 z-0"
      }`}
    >
      {/* Top Subtle Luminous Accent Line on Active Card */}
      {isActive && (
        <div
          aria-hidden="true"
          className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#7657ff] to-transparent rounded-full"
        />
      )}

      {/* Top Row: 5-Star Rating + Small Verified Patient Indicator */}
      <div className="flex items-center justify-between gap-3">
        {/* Star Rating */}
        <div
          className="flex items-center gap-1"
          aria-label={`Rated ${review.rating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(review.rating)
                  ? "fill-[#7657ff] text-[#7657ff] dark:fill-[#a99aff] dark:text-[#a99aff]"
                  : "text-neutral-300 dark:text-neutral-700 fill-transparent"
              }`}
            />
          ))}
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 ml-1.5 font-mono">
            {review.rating.toFixed(1)}
          </span>
        </div>

        {/* Small Verified Patient Indicator */}
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/80 dark:border-white/15 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 shadow-2xs">
          <Check className="w-3 h-3 stroke-[2.5]" />
          <span>Verified Patient</span>
        </div>
      </div>

      {/* Center: Editorial Short Quote */}
      <div className="my-6">
        <blockquote className="text-[17px] sm:text-[18px] font-normal leading-relaxed text-neutral-900 dark:text-neutral-100 tracking-tight">
          &ldquo;{reviewText}&rdquo;
        </blockquote>
      </div>

      {/* Bottom: Patient Profile & Medical Specialty */}
      <div className="pt-4 border-t border-neutral-200/50 dark:border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Elegant Avatar Squircle */}
          <div className="w-10 h-10 rounded-2xl bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/90 dark:border-white/15 text-neutral-900 dark:text-white flex items-center justify-center text-xs font-bold shadow-2xs">
            {review.initials}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">
              {review.name}
            </h4>
            <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {review.location}
            </p>
          </div>
        </div>

        {/* Medical Specialty Tag */}
        <div className="text-right">
          <span className="inline-block px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 text-[10.5px] font-semibold text-[#7657ff] dark:text-[#a99aff] uppercase tracking-wider shadow-2xs">
            {review.department}
          </span>
        </div>
      </div>
    </article>
  );
}

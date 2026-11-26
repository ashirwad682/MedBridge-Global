"use client";

import React from "react";
import Image from "next/image";

interface MedicalAIOrbProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function MedicalAIOrb({
  size = "lg",
  className = "",
}: MedicalAIOrbProps) {
  if (size === "sm") {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center p-0.5">
          <Image
            src="/images/medbridge-icon.png"
            alt="MedBridge AI Logo"
            width={20}
            height={20}
            className="w-full h-full object-contain dark:hidden"
          />
          <Image
            src="/images/medbridge-icon-white.png"
            alt="MedBridge AI Logo"
            width={20}
            height={20}
            className="w-full h-full object-contain hidden dark:block"
          />
        </div>
      </div>
    );
  }

  if (size === "md") {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <div className="absolute w-12 h-12 rounded-full bg-purple-500/25 blur-md animate-pulse" />
        <div className="relative w-10 h-10 rounded-full bg-white/80 dark:bg-[#121624]/85 backdrop-blur-md border border-neutral-200/60 dark:border-white/10 flex items-center justify-center p-2 shadow-sm">
          <Image
            src="/images/medbridge-icon.png"
            alt="MedBridge AI Logo"
            width={32}
            height={32}
            className="w-full h-full object-contain dark:hidden"
          />
          <Image
            src="/images/medbridge-icon-white.png"
            alt="MedBridge AI Logo"
            width={32}
            height={32}
            className="w-full h-full object-contain hidden dark:block"
          />
        </div>
      </div>
    );
  }

  // Large size for the Welcome Screen
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      {/* Outer Luminous Violet/Purple Glow Aura */}
      <div
        className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full blur-2xl opacity-60 transition-all pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.55) 0%, rgba(139,92,246,0.3) 45%, rgba(147,51,234,0.15) 70%, transparent 80%)",
          animation: "pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      />

      {/* Secondary Ambient Halo */}
      <div
        className="absolute w-22 h-22 sm:w-26 sm:h-26 rounded-full blur-lg opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(192,132,252,0.6) 0%, rgba(168,85,247,0.25) 60%, transparent 80%)",
        }}
      />

      {/* Main Core AI Logo Image with rounded glassmorphic container */}
      <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white/85 dark:bg-[#0f1322]/90 backdrop-blur-2xl border border-neutral-200/70 dark:border-white/15 flex items-center justify-center p-4 transition-transform duration-500 ease-out hover:scale-105 shadow-[0_8px_24px_-4px_rgba(147,51,234,0.35)]">
        <Image
          src="/images/medbridge-icon.png"
          alt="MedBridge AI Healthcare Assistant"
          width={80}
          height={80}
          priority
          className="w-full h-full object-contain dark:hidden"
        />
        <Image
          src="/images/medbridge-icon-white.png"
          alt="MedBridge AI Healthcare Assistant"
          width={80}
          height={80}
          priority
          className="w-full h-full object-contain hidden dark:block"
        />
      </div>
    </div>
  );
}

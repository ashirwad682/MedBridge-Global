"use client";

import React from "react";

export default function AmbientGlassBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-colors duration-700"
    >
      {/* Base theme background transition */}
      <div className="absolute inset-0 bg-[#F4F6FB] dark:bg-[#090A0F] transition-colors duration-700" />

      {/* ================================================================= */}
      {/* LIGHT MODE AMBIENT LUMINESCENCE (Soft Icy, Lavender, Ambient)     */}
      {/* ================================================================= */}
      <div className="absolute inset-0 dark:opacity-0 opacity-100 transition-opacity duration-700">
        {/* Soft icy cyan orb top-left */}
        <div className="absolute -top-32 -left-32 w-[580px] h-[580px] rounded-full bg-gradient-to-br from-[#dbeafe]/70 to-[#e0e7ff]/50 blur-[120px] transform-gpu" />

        {/* Ethereal lavender orb top-right */}
        <div className="absolute top-[15%] -right-40 w-[640px] h-[640px] rounded-full bg-gradient-to-bl from-[#ede9fe]/80 via-[#f5d0fe]/40 to-transparent blur-[130px] transform-gpu" />

        {/* Ambient pearl warm center-left */}
        <div className="absolute top-[48%] -left-20 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#f1f5f9]/90 to-[#e2e8f0]/40 blur-[110px] transform-gpu" />

        {/* Soft cool blush bottom-right */}
        <div className="absolute bottom-[5%] -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#ede9fe]/60 via-[#e0f2fe]/50 to-transparent blur-[140px] transform-gpu" />

        {/* Subtle organic light waves */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35 mix-blend-soft-light"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="meshLight" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#meshLight)" />
        </svg>
      </div>

      {/* ================================================================= */}
      {/* DARK MODE AMBIENT LUMINESCENCE (Midnight Graphite, Violet, Cyan)  */}
      {/* ================================================================= */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
        {/* Deep electric violet orb top-right */}
        <div className="absolute -top-20 -right-20 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-[#7657ff]/20 via-[#4f46e5]/15 to-transparent blur-[140px] transform-gpu" />

        {/* Oceanic cyan/sky orb center-left */}
        <div className="absolute top-[35%] -left-32 w-[560px] h-[560px] rounded-full bg-gradient-to-tr from-[#0284c7]/15 via-[#38bdf8]/10 to-transparent blur-[130px] transform-gpu" />

        {/* Deep midnight indigo orb bottom-right */}
        <div className="absolute bottom-[-10%] right-[10%] w-[680px] h-[680px] rounded-full bg-gradient-to-tl from-[#4338ca]/20 via-[#6366f1]/10 to-transparent blur-[150px] transform-gpu" />

        {/* Subtle dark ambient center glow */}
        <div className="absolute top-[60%] left-[20%] w-[480px] h-[480px] rounded-full bg-gradient-to-r from-[#581c87]/12 to-transparent blur-[130px] transform-gpu" />

        {/* Fine dark organic surface texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_75%)]" />
      </div>
    </div>
  );
}


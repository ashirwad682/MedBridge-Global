"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/site-config";
import { ArrowDown, Sparkles } from "lucide-react";

export default function HeroSection() {
  const { eyebrow, headlineLine1, headlineLine2, headlineLine3, description, stats } =
    SITE_CONFIG.hero;

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-12 md:pb-16"
    >
      {/* Outer Framed Hero Canvas */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full rounded-[30px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden min-h-[580px] lg:min-h-[660px] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 bg-white/45 dark:bg-white/[0.04] backdrop-blur-3xl border border-white/80 dark:border-white/12 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-colors duration-500">
          
          {/* Subtle light reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/[0.02] dark:from-white/[0.03] dark:to-transparent pointer-events-none" />

          {/* Soft ambient luminous backlight behind doctor */}
          <div
            className="absolute bottom-[-10%] right-[-2%] sm:right-[2%] md:right-[6%] lg:right-[10%] xl:right-[12%] w-[380px] sm:w-[460px] md:w-[520px] lg:w-[580px] xl:w-[620px] h-[88%] rounded-full pointer-events-none z-0 opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(118, 87, 255, 0.15) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 75%)",
            }}
          />

          {/* Blonde Female Doctor Seated Hero Photograph in Center-Right */}
          <div
            className="absolute bottom-0 right-[1%] sm:right-[4%] md:right-[8%] lg:right-[12%] xl:right-[15%] w-[310px] sm:w-[390px] md:w-[460px] lg:w-[510px] xl:w-[560px] h-[82%] sm:h-[88%] md:h-[92%] lg:h-[95%] xl:h-[96%] pointer-events-none select-none z-10"
            style={{
              WebkitMaskImage:
                "linear-gradient(to top, transparent 0%, black 12%, black 100%)",
              maskImage:
                "linear-gradient(to top, transparent 0%, black 12%, black 100%)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full"
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse 94% 92% at 50% 50%, black 72%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 94% 92% at 50% 50%, black 72%, transparent 100%)",
              }}
            >
              <Image
                src="/images/Smiling Blonde Doctor Portrait.png"
                alt="Smiling blonde female doctor in a white coat with stethoscope in a modern healthcare setting"
                fill
                priority
                quality={100}
                unoptimized
                sizes="(max-width: 640px) 310px, (max-width: 768px) 390px, (max-width: 1024px) 460px, (max-width: 1280px) 510px, 560px"
                className="object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              />
            </motion.div>
          </div>

          {/* Main Hero Two-Column Layout */}
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-start max-w-xl">
              {/* Eyebrow Pill */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/[0.08] backdrop-blur-md border border-white/80 dark:border-white/15 w-fit mb-4 md:mb-6 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7657ff] animate-pulse" />
                <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-neutral-800 dark:text-neutral-200">
                  {eyebrow}
                </span>
              </motion.div>

              {/* Large Crisp Uppercase Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-bold tracking-[-0.035em] uppercase leading-[0.93] text-neutral-900 dark:text-white text-[44px] sm:text-[56px] md:text-[66px] lg:text-[74px] xl:text-[80px] mb-8"
              >
                <span className="block">{headlineLine1}</span>
                <span className="block bg-gradient-to-r from-neutral-900 via-neutral-700 to-[#7657ff] dark:from-white dark:via-neutral-200 dark:to-[#a99aff] bg-clip-text text-transparent">
                  {headlineLine2}
                </span>
                <span className="block">{headlineLine3}</span>
              </motion.h1>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center gap-3.5 mb-10"
              >
                <Link
                  href={SITE_CONFIG.hero.primaryCta.href}
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_24px_-4px_rgba(255,255,255,0.2)] active:scale-[0.98]"
                >
                  {SITE_CONFIG.hero.primaryCta.label}
                </Link>
                <Link
                  href={SITE_CONFIG.hero.secondaryCta.href}
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-neutral-900 dark:text-white border border-white/80 dark:border-white/15 text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase transition-all duration-200 backdrop-blur-xl shadow-xs hover:shadow"
                >
                  {SITE_CONFIG.hero.secondaryCta.label}
                </Link>
              </motion.div>
            </div>

            {/* Right Side Statistics Column - Styled with Glassmorphic Tiles */}
            <div className="lg:col-span-5 flex flex-col lg:items-end justify-start pt-2 lg:pt-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.35, staggerChildren: 0.1 }}
                className="grid grid-cols-2 lg:flex lg:flex-col gap-3.5 sm:gap-4 lg:w-[240px]"
              >
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col lg:items-end p-4 rounded-2xl bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl border border-white/80 dark:border-white/12 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all hover:translate-y-[-2px]"
                  >
                    <div className="text-[30px] sm:text-[34px] lg:text-[38px] font-light tracking-tight text-neutral-900 dark:text-white leading-none">
                      {stat.value}
                    </div>
                    <div className="text-[11px] font-medium tracking-normal text-neutral-600 dark:text-neutral-400 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Hero Bottom Row: Description on Left & Scroll Indicator on Right */}
          <div className="relative z-20 pt-8 sm:pt-12 mt-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[13px] sm:text-[14px] text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-md font-normal"
            >
              {description}
            </motion.p>

            {/* Scroll Indicator button with glass circle */}
            <motion.a
              href="#services"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              aria-label="Scroll to services section"
              className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/50 dark:bg-white/10 border border-white/80 dark:border-white/15 text-neutral-800 dark:text-neutral-200 hover:bg-white dark:hover:bg-white/20 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SITE_CONFIG, ServiceCardData } from "@/lib/site-config";

export default function ServicesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const current = scrollContainerRef.current;
    if (current) {
      current.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (current) {
        current.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const cardWidth = 300;
    const scrollAmount = direction === "left" ? -cardWidth * 1.5 : cardWidth * 1.5;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="services" className="w-full py-16 md:py-24 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Left Heading, Right Carousel Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-xl">
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] mb-2 block">
              COORDINATED CARE
            </span>
            <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.08] mb-3">
              Everything you need for<br className="hidden sm:inline" /> better health — in one place.
            </h2>
            <p className="text-[13px] sm:text-[14px] text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg">
              Healthcare should feel connected, not complicated. Explore coordinated services, experienced professionals, and modern diagnostics in one seamless experience.
            </p>
          </div>

          {/* Carousel Frosted Glass Controls */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll services left"
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? "bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 text-neutral-900 dark:text-white hover:bg-white dark:hover:bg-white/20 shadow-xs active:scale-95"
                  : "bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/5 text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll services right"
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? "bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 text-neutral-900 dark:text-white hover:bg-white dark:hover:bg-white/20 shadow-xs active:scale-95"
                  : "bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/5 text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pt-1"
          style={{ scrollbarWidth: "none" }}
        >
          {SITE_CONFIG.services.map((service: ServiceCardData) => (
            <div
              key={service.id}
              className="flex-none snap-start w-[240px] sm:w-[260px] md:w-[280px] h-[340px] sm:h-[360px] relative rounded-[24px] overflow-hidden group cursor-pointer border border-white/70 dark:border-white/15 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.85)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-lg transition-all duration-500 bg-white/20 dark:bg-white/[0.04]"
            >
              {/* Background Image */}
              <Image
                src={service.image}
                alt={service.alt}
                fill
                sizes="(max-width: 640px) 240px, (max-width: 768px) 260px, 280px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Overlay for Crisp Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-opacity duration-300" />

              {/* Category Frosted Glass Pill Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-white/25 dark:bg-white/15 backdrop-blur-md text-[10px] font-medium tracking-wider uppercase text-white border border-white/30 shadow-xs">
                  {service.category}
                </span>
              </div>

              {/* Content in bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                <h3 className="text-white text-[16px] sm:text-[17px] font-semibold tracking-tight mb-1 leading-snug">
                  {service.title}
                </h3>
                <p className="text-neutral-300 text-[12px] leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

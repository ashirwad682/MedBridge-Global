import React from "react";
import Image from "next/image";

export default function HealthcareGallery() {
  const images = [
    {
      src: "/images/gallery-consultation.webp",
      alt: "Doctor providing compassionate consultation with patient",
      caption: "Patient-Centered Dialogue",
      tag: "Clinical Consultation",
      className: "md:col-span-8 md:row-span-2 aspect-[16/10] md:aspect-auto",
    },
    {
      src: "/images/gallery-teamwork.webp",
      alt: "Healthcare specialists collaborating on diagnosis",
      caption: "Multi-Disciplinary Team",
      tag: "Collaboration",
      className: "md:col-span-4 aspect-[4/3] md:aspect-auto",
    },
    {
      src: "/images/gallery-technology.webp",
      alt: "Modern diagnostic equipment in clinical suite",
      caption: "Advanced Diagnostics",
      tag: "Technology",
      className: "md:col-span-4 aspect-[4/3] md:aspect-auto",
    },
    {
      src: "/images/gallery-patient-care.webp",
      alt: "Doctor supporting patient through recovery milestone",
      caption: "Empathetic Follow-up",
      tag: "Continuous Care",
      className: "md:col-span-6 aspect-[16/10] md:aspect-[16/9]",
    },
    {
      src: "/images/gallery-clinic.webp",
      alt: "Serene, modern healthcare pavilion environment",
      caption: "Calm Healing Spaces",
      tag: "Facility",
      className: "md:col-span-6 aspect-[16/10] md:aspect-[16/9]",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#7657ff] dark:text-[#a99aff] block mb-2">
            EDITORIAL PERSPECTIVE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Care That Puts People First
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2.5">
            Every clinical decision, diagnostic test, and recovery pathway is built around human empathy and medical rigor.
          </p>
        </div>

        {/* Asymmetric Bento-Style Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 auto-rows-[240px] md:auto-rows-[280px]">
          {images.map((item, index) => (
            <div
              key={index}
              className={`relative rounded-[26px] overflow-hidden group border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] bg-white/20 dark:bg-white/[0.04] backdrop-blur-xl ${item.className}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Minimal Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag Pill at Top */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase text-white border border-white/25 shadow-xs">
                  {item.tag}
                </span>
              </div>

              {/* Caption at Bottom */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <p className="text-white text-sm sm:text-base font-semibold tracking-tight">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

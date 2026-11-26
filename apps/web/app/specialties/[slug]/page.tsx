import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpecialtyHero from "@/components/specialties/SpecialtyHero";
import ConditionsSection from "@/components/specialties/ConditionsSection";
import VisualServicesSection from "@/components/specialties/VisualServicesSection";
import SpecialistsShowcase from "@/components/specialties/SpecialistsShowcase";
import PatientJourney from "@/components/common/PatientJourney";
import HealthcareGallery from "@/components/common/HealthcareGallery";
import AppointmentCTASection from "@/components/sections/AppointmentCTASection";
import {
  SPECIALTIES_DATA,
  getDoctorsBySpecialty,
} from "@/lib/medical-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SPECIALTIES_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const specialty = SPECIALTIES_DATA[slug];

  if (!specialty) {
    return {
      title: "Specialty Not Found | MedBridge Global",
    };
  }

  return {
    title: `${specialty.name} | MedBridge Global Specialists`,
    description: specialty.shortIntro,
  };
}

export default async function SpecialtyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const specialty = SPECIALTIES_DATA[slug];

  if (!specialty) {
    notFound();
  }

  const doctors = getDoctorsBySpecialty(specialty.id);

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      {/* 1. Image-Led Split Specialty Hero */}
      <SpecialtyHero specialty={specialty} />

      {/* 2. Visual Conditions We Help Manage */}
      <ConditionsSection
        specialtyId={specialty.id}
        subtitle={specialty.conditionsSubtitle}
        conditions={specialty.conditions}
      />

      {/* 3. Image-Based Clinical Capabilities & Service Cards */}
      <VisualServicesSection
        specialtyId={specialty.id}
        specialtyName={specialty.name}
        services={specialty.services}
      />

      {/* 4. Meet Our Specialists Showcase */}
      <SpecialistsShowcase
        specialtyName={specialty.name}
        doctors={doctors}
      />

      {/* 5. Simplified 3-Step Patient Journey */}
      <PatientJourney />

      {/* 6. Editorial Healthcare Photography Gallery */}
      <HealthcareGallery />

      {/* 7. Redesigned Premium Appointment CTA */}
      <AppointmentCTASection />

      {/* 8. Compact Refined Footer */}
      <Footer />
    </main>
  );
}

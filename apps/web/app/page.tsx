import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import SpecialtiesSection from "@/components/sections/SpecialtiesSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import HealthcareGallery from "@/components/common/HealthcareGallery";
import AppointmentCTASection from "@/components/sections/AppointmentCTASection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative">
      {/* Floating Glass Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Services Carousel */}
      <ServicesSection />

      {/* Specialties Grid */}
      <SpecialtiesSection />

      {/* Why MedBridge Global - Benefits & Patient Reviews */}
      <BenefitsSection />

      {/* Coordinated Care Continuum - How It Works */}
      <HowItWorksSection />

      {/* Editorial Healthcare Photography Gallery */}
      <HealthcareGallery />

      {/* Appointment CTA Form & Consultation Intake */}
      <AppointmentCTASection />

      {/* Comprehensive Glass Footer */}
      <Footer />
    </main>
  );
}

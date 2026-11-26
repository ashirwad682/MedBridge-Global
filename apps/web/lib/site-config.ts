/**
 * MedBridge Global - Connected Healthcare Platform
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 *
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

/**
 * Site configuration and data dictionary for MedBridge Global
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface StatItemData {
  value: string;
  label: string;
}

export interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  category: string;
}

export interface SpecialtyItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
  href: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  badge: string;
  image: string;
  alt: string;
}

export interface JourneyStep {
  step: string;
  title: string;
  description: string;
}

export const SITE_CONFIG = {
  name: "MedBridge Global",
  logo: {
    src: "/images/medbridge-logo.png",
    srcWhite: "/images/medbridge-logo-white.png",
    icon: "/images/medbridge-icon.png",
    iconWhite: "/images/medbridge-icon-white.png",
    alt: "MedBridge",
  },
  title: "MedBridge Global | Connected Healthcare",
  description:
    "Discover connected healthcare services, medical specialists, and modern diagnostic care with MedBridge Global.",
  
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Specialties", href: "/#specialties" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],

  hero: {
    eyebrow: "CONNECTED HEALTHCARE, REIMAGINED",
    headlineLine1: "HEALTHCARE",
    headlineLine2: "CONNECTED",
    headlineLine3: "AROUND YOU",
    description:
      "From trusted specialists to coordinated medical services, MedBridge Global brings healthcare closer together — making expert care easier to access, navigate, and experience.",
    primaryCta: {
      label: "GET STARTED",
      href: "#appointment",
    },
    secondaryCta: {
      label: "EXPLORE SERVICES",
      href: "#services",
    },
    stats: [
      { value: "20K+", label: "Patients Supported" },
      { value: "30+", label: "Medical Specialists" },
      { value: "18", label: "Medical Specialties" },
      { value: "4.9/5", label: "Patient Satisfaction" },
    ] as StatItemData[],
  },

  services: [
    {
      id: "comprehensive-care",
      title: "Comprehensive Care",
      description: "From preventive checkups to specialist consultations.",
      image: "/images/comprehensive-care.webp",
      alt: "Experienced physician consulting with a patient",
      category: "Primary Care",
    },
    {
      id: "collaborative-doctors",
      title: "Collaborative Doctors",
      description: "Specialists working together to support coordinated care.",
      image: "/images/collaborative-doctors.webp",
      alt: "Medical professionals discussing a treatment plan",
      category: "Specialist Care",
    },
    {
      id: "modern-diagnostics",
      title: "Modern Diagnostics",
      description: "Modern testing and diagnostic services with clear reporting.",
      image: "/images/modern-diagnostics.webp",
      alt: "Clinical laboratory equipment and diagnostic imaging",
      category: "Diagnostics",
    },
    {
      id: "convenient-scheduling",
      title: "Convenient Scheduling",
      description: "Find the right specialist and manage appointments with ease.",
      image: "/images/convenient-scheduling.webp",
      alt: "Doctor consulting with a patient using a tablet",
      category: "Digital Access",
    },
    {
      id: "personalized-treatment",
      title: "Personalized Treatment",
      description: "Care plans shaped around individual needs and goals.",
      image: "/images/personalized-treatment.webp",
      alt: "Doctor discussing treatment options with a patient",
      category: "Specialized Care",
    },
    {
      id: "digital-health-records",
      title: "Digital Health Records",
      description: "Keep essential health information organized and accessible.",
      image: "/images/digital-health-records.webp",
      alt: "Medical professional reviewing digital health records",
      category: "Secure Records",
    },
  ] as ServiceCardData[],

  specialties: [
    {
      id: "internal-medicine",
      name: "Internal Medicine",
      iconName: "Stethoscope",
      description: "Comprehensive adult disease prevention, diagnosis, and long-term care.",
      href: "/specialties/internal-medicine",
    },
    {
      id: "family-medicine",
      name: "Family Medicine",
      iconName: "HeartPulse",
      description: "Continuity of care for patients and family members of all ages.",
      href: "/specialties/family-medicine",
    },
    {
      id: "cardiology",
      name: "Cardiology",
      iconName: "Activity",
      description: "Advanced cardiac evaluations, preventative vascular care, and diagnostics.",
      href: "/specialties/cardiology",
    },
    {
      id: "orthopedics",
      name: "Orthopedics",
      iconName: "Bone",
      description: "Musculoskeletal health, joint restoration, and active mobility therapy.",
      href: "/specialties/orthopedics",
    },
    {
      id: "neurology",
      name: "Neurology",
      iconName: "Brain",
      description: "Specialized neurological diagnostics, care coordination, and cognitive support.",
      href: "/specialties/neurology",
    },
    {
      id: "dermatology",
      name: "Dermatology",
      iconName: "Sparkles",
      description: "Medical and procedural dermatological evaluations with tailored care plans.",
      href: "/specialties/dermatology",
    },
    {
      id: "pediatrics",
      name: "Pediatrics",
      iconName: "Baby",
      description: "Dedicated developmental checks, adolescent care, and childhood medicine.",
      href: "/specialties/pediatrics",
    },
    {
      id: "diagnostic-imaging",
      name: "Diagnostic Imaging",
      iconName: "Scan",
      description: "Precision medical imaging reports with clear, coordinated doctor consultations.",
      href: "/specialties/diagnostic-imaging",
    },
  ] as SpecialtyItem[],

  benefits: [
    {
      title: "Unified Care Ecosystem",
      description: "Specialists, primary doctors, and diagnostic centers seamlessly share updates so you never repeat tests.",
      badge: "Coordinated Care",
      image: "/images/unified-care-team.jpg",
      alt: "Indian male and female doctors collaborating and discussing patient treatment in a modern hospital consultation",
    },
    {
      title: "Direct Specialist Access",
      description: "Streamlined referral pathways ensure you consult the most qualified clinician without weeks of delay.",
      badge: "Direct Access",
      image: "/images/specialist-consultation.jpg",
      alt: "Professional Indian specialist doctor in a white coat consulting with patient",
    },
    {
      title: "Transparent & Digital First",
      description: "Review lab summaries, treatment timelines, and appointment schedules through a unified interface.",
      badge: "Digital First",
      image: "/images/digital-healthcare.jpg",
      alt: "Indian physician reviewing electronic health records on laptop dashboard",
    },
    {
      title: "Patient-Centered Follow-up",
      description: "Dedicated clinical coordinators track your recovery milestones and guide subsequent care stages.",
      badge: "Continuous Care",
      image: "/images/patient-follow-up.jpg",
      alt: "Indian doctor interacting warmly with patient explaining recovery progress in modern clinic",
    },
  ] as BenefitItem[],

  journey: [
    {
      step: "01",
      title: "Select Specialist or Service",
      description: "Search by specialty, symptom, or doctor expertise with transparent availability and consultation types.",
    },
    {
      step: "02",
      title: "Consultation & Diagnostics",
      description: "Meet with top medical experts in-person or virtually, with instant synchronization of records.",
    },
    {
      step: "03",
      title: "Connected Care Plan",
      description: "Receive a tailored, multi-disciplinary care regimen with direct digital follow-up and monitoring.",
    },
  ] as JourneyStep[],

  footer: {
    columns: [
      {
        title: "Platform",
        links: [
          { label: "Overview", href: "/" },
          { label: "Services", href: "/#services" },
          { label: "Specialties", href: "/#specialties" },
          { label: "Doctors Directory", href: "/doctors" },
          { label: "Patient Portal", href: "/appointments" },
        ],
      },
      {
        title: "Specialties",
        links: [
          { label: "Internal Medicine", href: "#specialties" },
          { label: "Cardiology", href: "#specialties" },
          { label: "Orthopedics", href: "#specialties" },
          { label: "Neurology", href: "#specialties" },
        ],
      },
      {
        title: "Organization",
        links: [
          { label: "About MedBridge", href: "/#about" },
          { label: "Clinical Standards", href: "/#about" },
          { label: "Careers", href: "#" },
          { label: "Contact Us", href: "/contact" },
        ],
      },
      {
        title: "Compliance & Trust",
        links: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms of Service", href: "/terms-of-service" },
          { label: "HIPAA & Data Security", href: "/privacy-policy#compliance" },
          { label: "Patient Rights", href: "/privacy-policy#user-rights" },
        ],
      },
    ],
  },
};


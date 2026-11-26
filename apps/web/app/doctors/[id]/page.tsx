import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppointmentBookingForm from "@/components/booking/AppointmentBookingForm";
import { DOCTORS_DATA, getDoctorById, Doctor, mapDbDoctorToDoctor } from "@/lib/medical-data";
import { connectToDatabase } from "@/lib/db/mongodb";
import { DoctorProfile } from "@/lib/models/DoctorProfile";
import {
  ChevronRight,
  Star,
  Clock,
  Award,
  GraduationCap,
  Globe2,
  Building2,
  CheckCircle,
  Calendar,
  DollarSign,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return DOCTORS_DATA.map((doc) => ({
    id: doc.id,
  }));
}

async function resolveDoctor(id: string): Promise<Doctor | null> {
  try {
    await connectToDatabase();
    const query: Record<string, any> = { doctorId: id };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or = [{ doctorId: id }, { _id: id }];
      delete query.doctorId;
    }
    const doc: any = await DoctorProfile.findOne(query).lean();
    if (doc) {
      return mapDbDoctorToDoctor(doc);
    }
  } catch {
    // Database fallback
  }
  return getDoctorById(id) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const doctor = await resolveDoctor(id);

  if (!doctor) {
    return {
      title: "Physician Not Found | MedBridge Global",
    };
  }

  return {
    title: `${doctor.name} - ${doctor.specialtyName} | MedBridge Global`,
    description: doctor.bio,
  };
}

export default async function DoctorProfilePage({ params }: PageProps) {
  const { id } = await params;
  const doctor = await resolveDoctor(id);

  if (!doctor) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-14 md:pb-20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 mb-8">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <Link href="/doctors" className="hover:text-black transition-colors">
              Doctors
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <Link
              href={`/specialties/${doctor.specialtyId}`}
              className="hover:text-black transition-colors"
            >
              {doctor.specialtyName}
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <span className="text-neutral-900 font-medium">{doctor.name}</span>
          </nav>

          {/* Profile Header Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Doctor Photo */}
            <div className="lg:col-span-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-200 border border-neutral-200 shadow-md">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Quick Info Card */}
              <div className="mt-4 p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" /> Facility
                  </span>
                  <span className="font-semibold text-neutral-900 text-right">{doctor.hospitalAffiliation}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-neutral-400" /> Languages
                  </span>
                  <span className="font-semibold text-neutral-900">{doctor.languages.join(", ")}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" /> Experience
                  </span>
                  <span className="font-semibold text-neutral-900">{doctor.experienceYears} Years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-neutral-400" /> Initial Consult
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-white">{doctor.consultationFee}</span>
                </div>
              </div>
            </div>

            {/* Doctor Overview & Bio */}
            <div className="lg:col-span-8 flex flex-col justify-start">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Link
                  href={`/specialties/${doctor.specialtyId}`}
                  className="inline-block px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-neutral-200/80 dark:border-white/10 text-neutral-800 dark:text-neutral-200 text-[11px] font-bold tracking-wider uppercase hover:bg-white dark:hover:bg-white/20 transition-colors"
                >
                  {doctor.specialtyName}
                </Link>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 text-xs font-semibold backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{doctor.rating}</span>
                  <span className="text-amber-700 dark:text-amber-400 font-normal">({doctor.reviewsCount} verified reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white leading-tight mb-2">
                {doctor.name}
              </h1>
              <p className="text-base sm:text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-6">
                {doctor.title}
              </p>

              {/* Bio */}
              <div className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Biography & Clinical Focus
                </h2>
                <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {doctor.bio}
                </p>
              </div>

              {/* Areas of Expertise */}
              <div className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                  Areas of Clinical Expertise
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.areasOfExpertise.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-neutral-200/80 dark:border-white/10 text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-2xs"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education & Fellowships */}
              <div className="mb-8 p-6 rounded-2xl bg-white/70 dark:bg-white/[0.06] backdrop-blur-md border border-neutral-200/80 dark:border-white/10 shadow-xs">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                  Education, Fellowships & Board Certifications
                </h2>
                <ul className="space-y-2.5">
                  {doctor.education.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                      <CheckCircle className="w-4 h-4 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Availability Notice */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2.5 backdrop-blur-md">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Consultation Schedule:</strong> {doctor.availability}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Booking Section for this Doctor */}
      <section id="book-doctor" className="py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full bg-neutral-900/5 dark:bg-white/10 border border-neutral-200/80 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-[11px] font-semibold tracking-wider uppercase mb-3">
              Direct Physician Booking
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white mb-2">
              Schedule with {doctor.name}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Confirm your appointment slot with {doctor.name} for comprehensive outpatient evaluation.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-[#12141c]/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-neutral-900 dark:text-white border border-neutral-200/80 dark:border-white/10 shadow-2xl">
            <Suspense fallback={<div className="py-20 text-center text-sm text-neutral-500 dark:text-neutral-400">Loading booking form...</div>}>
              <AppointmentBookingForm
                initialSpecialtyId={doctor.specialtyId}
                initialDoctorId={doctor.id}
              />
            </Suspense>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


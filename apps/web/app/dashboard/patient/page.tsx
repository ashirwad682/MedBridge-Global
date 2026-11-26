"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/components/auth/AuthContext";
import { useBooking } from "@/components/booking/BookingContext";
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  FileText,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Stethoscope,
  Phone,
  HeartPulse,
  RefreshCw,
  XCircle,
} from "lucide-react";

interface AppointmentItem {
  id: string;
  bookingReference: string;
  doctorName: string;
  doctorSpecialty: string;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  status: string;
  notes: string;
  clinicRoom: string;
}

interface DiagnosticRecord {
  id: string;
  title: string;
  doctor: string;
  date: string;
  status: string;
  category: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const { user, isLoading, openAuthModal } = useAuth();
  const { openBooking } = useBooking();

  const [metrics, setMetrics] = useState({
    upcomingVisitsCount: 1,
    diagnosticReportsCount: 2,
    careSpecialistsCount: 3,
    followUpStage: "Stage 02",
  });
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [records, setRecords] = useState<DiagnosticRecord[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Route & Role protection
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        openAuthModal("login", "patient");
      } else if (user.role === "doctor") {
        router.replace("/dashboard/doctor");
      }
    }
  }, [user, isLoading, openAuthModal, router]);

  // Fetch patient profile, real MongoDB appointments, and medical records
  const loadPatientData = useCallback(async () => {
    if (!user || user.role !== "patient") return;
    setIsDataLoading(true);

    try {
      const res = await fetch("/api/patient/profile");
      if (res.ok) {
        const data = await res.json();
        setMetrics({
          upcomingVisitsCount: data.upcomingVisitsCount ?? 0,
          diagnosticReportsCount: data.diagnosticReportsCount ?? 0,
          careSpecialistsCount: data.careSpecialistsCount ?? 0,
          followUpStage: data.followUpStage ?? "Stage 01",
        });

        if (Array.isArray(data.upcomingAppointments)) {
          setAppointments(data.upcomingAppointments);
        }

        if (Array.isArray(data.medicalRecords)) {
          setRecords(data.medicalRecords);
        }
      }
    } catch (err) {
      console.warn("Error loading patient profile from MongoDB:", err);
    } finally {
      setIsDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "patient") {
      loadPatientData();
    }
  }, [user, loadPatientData]);

  // Cancel consultation in MongoDB
  const handleCancelAppointment = async (bookingRef: string) => {
    if (!confirm(`Are you sure you want to cancel appointment ${bookingRef}?`)) return;

    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: bookingRef, status: "CANCELLED" }),
      });

      if (res.ok) {
        setActionMessage(`Appointment ${bookingRef} has been cancelled successfully.`);
        setTimeout(() => setActionMessage(null), 4000);
        loadPatientData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel appointment.");
      }
    } catch {
      alert("Unable to process appointment cancellation.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-900 dark:text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-[#7657ff] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Loading Patient Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col justify-between text-neutral-900 dark:text-white">
        <Navbar />
        <div className="max-w-md mx-auto text-center px-4 py-36">
          <AlertCircle className="w-12 h-12 text-[#7657ff] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6">
            Please log in with your patient account to access your medical records and appointments.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal("login", "patient")}
            className="px-6 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            Sign In to Patient Portal
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  // Cross-role protection warning
  if (user.role === "doctor") {
    return (
      <main className="min-h-screen flex flex-col justify-between text-neutral-900 dark:text-white">
        <Navbar />
        <div className="max-w-md mx-auto text-center px-4 py-36">
          <Stethoscope className="w-12 h-12 text-[#7657ff] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Doctor Account Detected</h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6">
            You are currently signed in as a physician. Please switch to your clinical dashboard.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/doctor")}
            className="px-6 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            Go to Doctor Dashboard
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      <section className="pt-24 sm:pt-28 pb-16 md:pb-24 flex-1">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {actionMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
              <span>{actionMessage}</span>
              <button onClick={() => setActionMessage(null)} className="text-xs font-bold hover:underline">Dismiss</button>
            </div>
          )}

          {/* Header Frosted Glass Banner */}
          <div className="p-6 sm:p-8 rounded-[28px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 text-[#7657ff] dark:text-[#a99aff] border border-white/80 dark:border-white/15 shadow-2xs">
                  PATIENT PORTAL
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                  <CheckCircle2 className="w-3 h-3" /> Active Profile
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Welcome back, {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-normal">
                {user.email} • Synchronized Patient ID: #{user.id.toUpperCase().slice(-8)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => loadPatientData()}
                className="p-2.5 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-white/80 dark:border-white/15 text-neutral-700 dark:text-neutral-300 transition-colors shadow-2xs"
                title="Refresh live database data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isDataLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => openBooking()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid (Live from MongoDB) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-white/55 dark:bg-white/[0.05] backdrop-blur-xl border border-white/80 dark:border-white/12 shadow-2xs">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 block mb-1">UPCOMING VISITS</span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                {metrics.upcomingVisitsCount}
              </span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Confirmed consultation</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/55 dark:bg-white/[0.05] backdrop-blur-xl border border-white/80 dark:border-white/12 shadow-2xs">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 block mb-1">DIAGNOSTIC REPORTS</span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                {metrics.diagnosticReportsCount}
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Synced to electronic record</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/55 dark:bg-white/[0.05] backdrop-blur-xl border border-white/80 dark:border-white/12 shadow-2xs">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 block mb-1">CARE SPECIALISTS</span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                {metrics.careSpecialistsCount}
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Coordinated care team</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/55 dark:bg-white/[0.05] backdrop-blur-xl border border-white/80 dark:border-white/12 shadow-2xs">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 block mb-1">FOLLOW-UP STAGE</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#7657ff] dark:text-[#a99aff]">
                {metrics.followUpStage}
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Consultation continuum</p>
            </div>
          </div>

          {/* Main Dashboard Content: Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (2 Cols): Next Appointment & Health Records */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Confirmed Upcoming Appointments (Live from MongoDB) */}
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt.id} className="p-6 sm:p-7 rounded-[26px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-2xs">
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-white/10 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white bg-white/70 dark:bg-white/10 px-2.5 py-0.5 rounded-full border border-white/80 dark:border-white/15">
                          {apt.bookingReference}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3" /> {apt.status}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 font-medium">{apt.type}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <span className="text-xs text-neutral-400 font-medium block">Specialist</span>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                          {apt.doctorName}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{apt.doctorSpecialty}</p>
                      </div>

                      <div>
                        <span className="text-xs text-neutral-400 font-medium block">Scheduled Date & Time</span>
                        <p className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
                          {apt.appointmentDate} at {apt.appointmentTime}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{apt.clinicRoom}</p>
                      </div>
                    </div>

                    {apt.notes && (
                      <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 text-xs text-neutral-600 dark:text-neutral-300 mb-5">
                        <span className="font-bold text-neutral-900 dark:text-white block mb-0.5">Visit Notes & Intake:</span>
                        {apt.notes}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => openBooking()}
                        className="px-4 py-2 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-white/80 dark:border-white/15 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelAppointment(apt.bookingReference)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                      <Link
                        href={`/appointments?id=${encodeURIComponent(apt.bookingReference)}`}
                        className="px-4 py-2 rounded-full border border-white/80 dark:border-white/15 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors"
                      >
                        View Full Booking Slip
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-[26px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 text-center">
                  <Calendar className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
                    No Upcoming Consultations
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 max-w-sm mx-auto">
                    You currently have no scheduled appointments. Connect with our board-certified specialists at your convenience.
                  </p>
                  <button
                    type="button"
                    onClick={() => openBooking()}
                    className="px-5 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Schedule an Appointment
                  </button>
                </div>
              )}

              {/* Diagnostic Summaries & Electronic Records (Live from MongoDB) */}
              <div className="p-6 sm:p-7 rounded-[26px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Synchronized Health Records</h3>
                  <span className="text-xs text-neutral-400">Encrypted Cloud Storage</span>
                </div>

                <div className="space-y-3">
                  {records.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-white/10 border border-white/80 dark:border-white/15 flex items-center justify-center text-[#7657ff] dark:text-[#a99aff]">
                          {rec.category === "cardiology" ? (
                            <HeartPulse className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{rec.title}</h4>
                          <p className="text-[11px] text-neutral-400">{rec.doctor} • {rec.date}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-neutral-900 dark:text-white px-2.5 py-1 rounded-full bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15">
                        {rec.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (1 Col): Care Team & Coordinated Services */}
            <div className="space-y-6">
              
              {/* Coordinated Care Team */}
              <div className="p-6 rounded-[26px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-2xs">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4">Your Coordinated Care Team</h3>
                
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold shrink-0">
                      RA
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">Dr. Ritu Agarwal</h4>
                      <p className="text-[11px] text-neutral-400 truncate">Attending Dermatologist</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold shrink-0">
                      ST
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">Dr. Sarah Thorne</h4>
                      <p className="text-[11px] text-neutral-400 truncate">Internal Medicine Specialist</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#7657ff] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      AS
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">Ananya S.</h4>
                      <p className="text-[11px] text-neutral-400 truncate">Clinical Care Coordinator</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-200/50 dark:border-white/10">
                  <Link
                    href="/doctors"
                    className="text-xs font-bold text-[#7657ff] dark:text-[#a99aff] hover:underline flex items-center justify-between"
                  >
                    <span>Browse All Specialists</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Patient Care Support Card */}
              <div className="p-6 rounded-[26px] bg-white/70 dark:bg-white/[0.08] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-2xs">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1">
                  24/7 COORDINATION
                </span>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-2">Need Clinical Assistance?</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal mb-4">
                  Our clinical coordinators are available to answer queries, transfer medical records, and expedite appointments.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Phone className="w-3.5 h-3.5 text-[#7657ff] dark:text-[#a99aff]" />
                    <span>+1 (800) 420-MEDBRIDGE</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Confidential HIPAA Aligned</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}

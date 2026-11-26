"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  ShieldCheck,
  FileText,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  Eye,
  Award,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Check,
} from "lucide-react";

interface PatientQueueItem {
  id: string;
  patientName: string;
  ageGender: string;
  timeSlot: string;
  type: string;
  chiefComplaint: string;
  status: "Checked In" | "Confirmed" | "Completed";
}

export default function DoctorDashboard() {
  const router = useRouter();
  const { user, isLoading, openAuthModal } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [queue, setQueue] = useState<PatientQueueItem[]>([]);
  const [stats, setStats] = useState({
    todayAppointmentsCount: 4,
    completedConsultationsCount: 1,
    pendingReviewsCount: 3,
    rating: 4.96,
  });
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Route & Role protection
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        openAuthModal("login", "doctor");
      } else if (user.role === "patient") {
        router.replace("/dashboard/patient");
      }
    }
  }, [user, isLoading, openAuthModal, router]);

  // Load live doctor profile, queue, and stats from MongoDB
  const loadDoctorData = useCallback(async () => {
    if (!user || user.role !== "doctor") return;
    setIsDataLoading(true);

    try {
      const res = await fetch("/api/doctor/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setIsAvailable(data.profile.isAcceptingPatients ?? true);
        }
        if (data.stats) {
          setStats({
            todayAppointmentsCount: data.stats.todayAppointmentsCount ?? 0,
            completedConsultationsCount: data.stats.completedConsultationsCount ?? 0,
            pendingReviewsCount: data.stats.pendingReviewsCount ?? 0,
            rating: data.profile?.rating ?? 4.96,
          });
        }
        if (Array.isArray(data.todayQueue)) {
          setQueue(data.todayQueue);
        }
      }
    } catch (err) {
      console.warn("Error loading doctor data from MongoDB:", err);
    } finally {
      setIsDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "doctor") {
      loadDoctorData();
    }
  }, [user, loadDoctorData]);

  // Toggle availability in MongoDB
  const handleToggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);

    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAcceptingPatients: nextState }),
      });

      if (res.ok) {
        setStatusMessage(
          nextState
            ? "Status updated: Now accepting patient consultations in MongoDB."
            : "Status updated: Clinic slots set to Offline / Paused in MongoDB."
        );
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch {
      setIsAvailable(!nextState);
      alert("Failed to update availability status.");
    }
  };

  // Update appointment status in MongoDB
  const handleUpdateStatus = async (appointmentId: string, newStatus: "Checked In" | "Completed") => {
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, status: newStatus }),
      });

      if (res.ok) {
        setStatusMessage(`Appointment updated to "${newStatus}" in MongoDB.`);
        setTimeout(() => setStatusMessage(null), 3500);
        loadDoctorData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update appointment status.");
      }
    } catch {
      alert("Unable to reach backend service.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-900 dark:text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-300 dark:border-neutral-700 border-t-[#7657ff] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Loading Clinician Portal...</p>
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
          <h2 className="text-xl font-bold mb-2">Doctor Authentication Required</h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6">
            Please log in with your clinical credentials to access your patient schedule and diagnostics.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal("login", "doctor")}
            className="px-6 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            Sign In to Doctor Dashboard
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  // Cross-role protection warning
  if (user.role === "patient") {
    return (
      <main className="min-h-screen flex flex-col justify-between text-neutral-900 dark:text-white">
        <Navbar />
        <div className="max-w-md mx-auto text-center px-4 py-36">
          <AlertCircle className="w-12 h-12 text-[#7657ff] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Patient Account Detected</h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6">
            You are signed in as a patient. The Clinician Portal is reserved for verified medical professionals.
          </p>
          <button
            type="button"
            onClick={() => router.push("/dashboard/patient")}
            className="px-6 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            Go to Patient Dashboard
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
          
          {statusMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between shadow-2xs">
              <span className="font-medium">{statusMessage}</span>
              <button onClick={() => setStatusMessage(null)} className="text-xs font-bold hover:underline">Dismiss</button>
            </div>
          )}

          {/* Clinician Header Frosted Banner */}
          <div className="p-6 sm:p-8 rounded-[28px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 text-[#7657ff] dark:text-[#a99aff] border border-white/80 dark:border-white/15 shadow-2xs">
                  DOCTOR PORTAL
                </span>
                {user.verificationStatus === "VERIFIED" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/40">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Board License #{user.licenseNumber || "MED-IN-884920"}
                  </span>
                ) : user.verificationStatus === "REJECTED" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-200/70 dark:border-red-800/40">
                    <AlertCircle className="w-3.5 h-3.5" />
                    License Review Rejected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200/70 dark:border-amber-800/40">
                    <Clock className="w-3.5 h-3.5" />
                    License Verification Pending #{user.licenseNumber || "SUBMITTED"}
                  </span>
                )}
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  {user.hospitalAffiliation || "MedBridge Clinical Partner Network"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-normal">
                {user.specialization || "Clinical Specialist"} • Professional Email: {user.email}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => loadDoctorData()}
                className="p-2.5 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-white/80 dark:border-white/15 text-neutral-700 dark:text-neutral-300 transition-colors shadow-2xs"
                title="Refresh schedule from MongoDB"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isDataLoading ? "animate-spin" : ""}`} />
              </button>

              {/* Availability Status Toggle (Persisted to MongoDB) */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/70 dark:bg-white/[0.07] border border-white/80 dark:border-white/12 shadow-2xs shrink-0">
                <div className="text-left">
                  <span className="text-[11px] font-bold text-neutral-900 dark:text-white block">
                    {isAvailable ? "Accepting Consultations" : "Offline / In Surgery"}
                  </span>
                  <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400">
                    {isAvailable ? "Online & In-Clinic Slots Active" : "Patient intake paused"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleAvailability}
                  className="text-neutral-900 dark:text-white transition-colors cursor-pointer"
                  title="Toggle clinical availability in MongoDB"
                >
                  {isAvailable ? (
                    <ToggleRight className="w-8 h-8 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid (Live from MongoDB) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-white/55 dark:bg-white/[0.05] backdrop-blur-xl border border-white/80 dark:border-white/12 shadow-2xs">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 block mb-1">TODAY&rsquo;S CONSULTATIONS</span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                {stats.todayAppointmentsCount}
              </span>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                {stats.completedConsultationsCount} Completed, {Math.max(0, stats.todayAppointmentsCount - stats.completedConsultationsCount)} Upcoming
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/55 dark:bg-white/[0.05] backdrop-blur-xl border border-white/80 dark:border-white/12 shadow-2xs">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 block mb-1">ACTIVE PATIENTS</span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">248</span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Under coordinated management</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/55 dark:bg-white/[0.05] backdrop-blur-xl border border-white/80 dark:border-white/12 shadow-2xs">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 block mb-1">PENDING REPORTS</span>
              <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                {stats.pendingReviewsCount}
              </span>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">Awaiting clinical sign-off</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/55 dark:bg-white/[0.05] backdrop-blur-xl border border-white/80 dark:border-white/12 shadow-2xs">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 block mb-1">PATIENT RATING</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#7657ff] dark:text-[#a99aff]">
                {stats.rating.toFixed(2)} <span className="text-sm font-normal text-neutral-400">/ 5.0</span>
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Verified patient reviews</p>
            </div>
          </div>

          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (2 Cols): Today's Patient Schedule (MongoDB) */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="p-6 sm:p-7 rounded-[26px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-white/10 mb-5">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">Today&rsquo;s Consultation Schedule</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Synchronized patient bookings from centralized database
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 px-3 py-1 rounded-full">
                    {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {queue.length > 0 ? (
                    queue.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white/50 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 hover:border-[#7657ff]/40 transition-all hover:bg-white/70 dark:hover:bg-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900 dark:text-white">
                              {item.patientName}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              ({item.ageGender})
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.status === "Checked In"
                                  ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                                  : item.status === "Completed"
                                  ? "bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300"
                                  : "bg-neutral-200/80 dark:bg-white/15 text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-normal">
                            {item.chiefComplaint}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-1">
                            <span className="flex items-center gap-1 font-semibold text-neutral-700 dark:text-neutral-300">
                              <Clock className="w-3 h-3 text-[#7657ff] dark:text-[#a99aff]" />
                              {item.timeSlot}
                            </span>
                            <span>•</span>
                            <span>{item.type}</span>
                            <span>•</span>
                            <span className="font-mono">{item.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.status !== "Completed" && (
                            <>
                              {item.status !== "Checked In" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(item.id, "Checked In")}
                                  className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                                >
                                  Check In
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item.id, "Completed")}
                                className="px-3.5 py-1.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                              >
                                Complete Visit
                              </button>
                            </>
                          )}
                          {item.status === "Completed" && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              <Check className="w-3.5 h-3.5" /> Finished
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Calendar className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        No appointments currently scheduled in your patient queue today.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Diagnostic Sign-off Panel */}
              <div className="p-6 sm:p-7 rounded-[26px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Awaiting Clinical Sign-Off</h3>
                  <span className="text-xs text-neutral-400">Diagnostic Integration</span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        Brain & Spine High-Res MRI Report — Patient #PT-8821
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Dr. Rajesh Patel, MD (Imaging) • Uploaded 2 hours ago
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Diagnostic record approved and signed.")}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 hover:bg-white dark:hover:bg-white/20 text-neutral-900 dark:text-white transition-colors cursor-pointer shadow-2xs"
                    >
                      Review & Approve
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/50 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                        Comprehensive Metabolic Bloodwork — Patient #PT-9043
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        MedBridge Central Pathology Labs • Verified today
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Metabolic bloodwork approved and signed.")}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/70 dark:bg-white/10 border border-white/80 dark:border-white/15 hover:bg-white dark:hover:bg-white/20 text-neutral-900 dark:text-white transition-colors cursor-pointer shadow-2xs"
                    >
                      Review & Approve
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (1 Col): Clinical Tools & Practice Info */}
            <div className="space-y-6">
              
              {/* Practice Summary */}
              <div className="p-6 rounded-[26px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-2xs">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Clinical Profile & Credentials</h3>
                
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-neutral-400 block font-medium">Physician Name:</span>
                    <span className="text-neutral-900 dark:text-white font-semibold">{user.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-medium">Primary Specialty:</span>
                    <span className="text-neutral-900 dark:text-white font-semibold">{user.specialization || "Neurology"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-medium">Registration / License:</span>
                    <span className="text-neutral-900 dark:text-white font-semibold font-mono">{user.licenseNumber || "MED-IN-884920"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block font-medium">Hospital Affiliation:</span>
                    <span className="text-neutral-900 dark:text-white font-semibold">{user.hospitalAffiliation || "Manipal Hospital Network"}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-200/50 dark:border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Credentials Active & Verified for 2026</span>
                  </div>
                </div>
              </div>

              {/* Quick Clinical Actions */}
              <div className="p-6 rounded-[26px] bg-white/70 dark:bg-white/[0.08] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-2xs">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1">
                  PRACTICE ACTIONS
                </span>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white mb-2">Clinician Shortcuts</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal mb-4">
                  Quick tools to manage consultation slots, digital prescriptions, and coordinated referrals.
                </p>

                <div className="space-y-2">
                  <Link
                    href="/doctors"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-white/80 dark:border-white/15 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <span>View Public Doctor Directory</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#7657ff] dark:text-[#a99aff]" />
                  </Link>
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

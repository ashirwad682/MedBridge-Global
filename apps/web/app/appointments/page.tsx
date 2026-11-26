"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AppointmentRecord } from "@/lib/medical-data";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const initialId = searchParams.get("id") || "";

  const [queryInput, setQueryInput] = useState(initialEmail || initialId);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  const fetchAppointments = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Please enter your registered email address or appointment reference code.");
      return;
    }
    setError("");
    setIsLoading(true);
    setHasSearched(true);

    try {
      const isId = trimmed.toUpperCase().startsWith("MBG-");
      const url = isId
        ? `/api/appointments?id=${encodeURIComponent(trimmed.toUpperCase())}`
        : `/api/appointments?email=${encodeURIComponent(trimmed.toLowerCase())}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to retrieve appointments.");
      }

      setAppointments(data.appointments || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to search appointments at this time.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (aptId: string) => {
    if (!confirm(`Are you sure you want to cancel appointment ${aptId}?`)) return;
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: aptId, status: "CANCELLED" }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === aptId ? { ...a, status: "cancelled" } : a))
        );
      } else {
        const d = await res.json();
        alert(d.error || "Failed to cancel appointment.");
      }
    } catch {
      alert("Error reaching appointment cancellation service.");
    }
  };

  useEffect(() => {
    if (initialEmail || initialId) {
      fetchAppointments(initialEmail || initialId);
    }
  }, [initialEmail, initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAppointments(queryInput);
  };

  return (
    <div>
      {/* Lookup Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] block mb-2">
          PATIENT PORTAL
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-3">
          Manage Your Appointments
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Enter your registered email address or appointment reference code (e.g. MBG-2026-XXXX) to access your upcoming consultations.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Enter email (e.g. sarah.connor@example.com) or booking ID"
              className="w-full pl-11 pr-4 py-3 rounded-full border border-white/80 dark:border-white/15 bg-white/70 dark:bg-white/[0.07] backdrop-blur-xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/40 shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-7 py-3 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold tracking-wider uppercase disabled:bg-neutral-400 transition-all cursor-pointer shadow-xs"
          >
            {isLoading ? "Searching..." : "Lookup Records"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="max-w-3xl mx-auto">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-white/10 text-xs text-neutral-600 dark:text-neutral-400">
                <span>
                  Found <strong>{appointments.length}</strong> scheduled consultation{appointments.length !== 1 ? "s" : ""}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Confidential Patient Record
                </span>
              </div>

              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-[24px] bg-white/60 dark:bg-white/[0.05] backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] p-6 sm:p-7 transition-all hover:shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200/50 dark:border-white/10">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white bg-white/70 dark:bg-white/10 px-2.5 py-0.5 rounded-full border border-white/80 dark:border-white/15">
                          {apt.id}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold uppercase tracking-wider border border-emerald-200/50 dark:border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3" /> Confirmed
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        {apt.specialtyName} Consultation
                      </h3>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">Booked On</div>
                      <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                        {new Date(apt.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400 font-medium block">Attending Physician:</span>
                      <span className="text-neutral-900 dark:text-white font-semibold text-sm">{apt.doctorName}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400 font-medium block">Scheduled Date & Time:</span>
                      <span className="text-neutral-900 dark:text-white font-semibold text-sm">
                        {new Date(apt.date + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at {apt.timeSlot}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400 font-medium block">Patient Name:</span>
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">{apt.patientName}</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400 font-medium block">Contact Phone:</span>
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">{apt.patientPhone}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.04] border border-white/80 dark:border-white/10 text-xs text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold block mb-0.5 text-neutral-900 dark:text-white">Chief Reason / Notes:</span>
                    <span>{apt.reason}</span>
                  </div>

                  {apt.status !== "cancelled" && (
                    <div className="mt-3.5 pt-3 border-t border-neutral-200/50 dark:border-white/10 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCancel(apt.id)}
                        className="px-3.5 py-1.5 rounded-full border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel Consultation
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-[28px] bg-white/50 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/80 dark:border-white/12 text-center">
              <FileText className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">No appointments found</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto mb-6">
                No active appointments were found matching &quot;{queryInput}&quot;. Please verify the email address or book a new appointment.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                Schedule an Appointment <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      <section className="pt-28 sm:pt-36 pb-16 md:pb-24 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="py-20 text-center text-sm text-neutral-500">Loading portal...</div>}>
            <AppointmentsContent />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}

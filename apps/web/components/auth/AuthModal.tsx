"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ArrowLeft,
  User,
  Stethoscope,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Activity,
} from "lucide-react";
import { useAuth, AuthModalMode } from "./AuthContext";
import { UserRole } from "@/lib/auth";

const MEDICAL_SPECIALTIES = [
  "Cardiology",
  "Orthopedics & Spine",
  "Internal Medicine",
  "Neurology",
  "Dermatology",
  "Family Medicine",
  "Pediatrics",
  "Diagnostic Imaging",
];

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    authRole,
    setAuthRole,
    login,
    register,
  } = useAuth();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState(MEDICAL_SPECIALTIES[0]);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Reset errors and feedback when mode or role changes
  useEffect(() => {
    setError(null);
    setForgotPasswordSent(false);
  }, [authModalMode, authRole, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSelectRole = (role: UserRole, mode: AuthModalMode = "login") => {
    setAuthRole(role);
    setAuthModalMode(mode);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (authModalMode === "login") {
        await login({ email: email.trim(), password, role: authRole });
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match. Please verify.");
        }
        await register({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          role: authRole,
          specialization: authRole === "doctor" ? specialization : undefined,
          licenseNumber: authRole === "doctor" ? licenseNumber.trim() : undefined,
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during authentication.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your registered email address first.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process password reset.");
      }
      setForgotPasswordSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to process password reset request.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // High-resolution Indian Doctor photography:
  // Patient mode: Warm, welcoming Indian female doctor in modern luxury hospital
  // Doctor mode: Confident, distinguished Indian male specialist in executive clinical suite
  const leftPanelImage =
    authRole === "doctor"
      ? "/images/luxury-indian-doctor-male.jpg"
      : "/images/luxury-indian-doctor-female.jpg";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[1220px] h-[92vh] max-h-[760px] min-h-[580px] bg-white/95 dark:bg-[#0f121d]/95 backdrop-blur-3xl rounded-[28px] sm:rounded-[34px] border border-white/80 dark:border-white/15 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.35)] flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* ============================================================== */}
        {/* MOBILE COMPACT BANNER (< md screens)                           */}
        {/* ============================================================== */}
        <div className="md:hidden relative h-36 sm:h-44 w-full shrink-0 overflow-hidden bg-neutral-900">
          <Image
            src={leftPanelImage}
            alt="MedBridge Global Healthcare"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30 pointer-events-none" />
          
          <div className="relative z-10 h-full p-4 sm:p-5 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <Image
                src="/images/medbridge-logo-white.png"
                alt="MedBridge Global"
                width={130}
                height={26}
                className="h-5 w-auto object-contain"
              />
              <button
                type="button"
                onClick={closeAuthModal}
                className="w-7 h-7 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-neutral-300 block mb-0.5">
                MEDBRIDGE GLOBAL
              </span>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                {authRole === "doctor"
                  ? "Care begins with the right connection."
                  : "Healthcare that puts you first."}
              </h3>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* LEFT PANEL – EDITORIAL HEALTHCARE PHOTOGRAPHY (Desktop: 45%)   */}
        {/* ============================================================== */}
        <div className="hidden md:block md:w-[45%] h-full shrink-0 relative overflow-hidden bg-neutral-950 select-none">
          {/* Full-Height Professional Indian Doctor Photograph */}
          <div className="absolute inset-0">
            <Image
              src={leftPanelImage}
              alt="Professional Indian Doctor in modern luxury hospital"
              fill
              priority
              sizes="(min-width: 768px) 550px, 100vw"
              className="object-cover object-center transition-all duration-700 ease-out"
            />
          </div>

          {/* Carefully blended dark gradient overlay for optimal readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 via-55% to-black/25 pointer-events-none" />
          <div className="absolute inset-0 bg-neutral-950/15 pointer-events-none" />

          {/* Left Panel Content Overlay */}
          <div className="relative z-10 h-full p-8 lg:p-10 flex flex-col justify-between text-white">
            
            {/* Top Brand Header */}
            <div>
              <div className="mb-2">
                <Image
                  src="/images/medbridge-logo-white.png"
                  alt="MedBridge Global Logo"
                  width={170}
                  height={36}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-neutral-300/90 block">
                MEDBRIDGE GLOBAL
              </span>
            </div>

            {/* Bottom Content & Trust Indicators */}
            <div className="space-y-6 pb-2">
              <div>
                <h2 className="text-2xl lg:text-[28px] xl:text-[30px] font-bold tracking-tight text-white leading-[1.18] mb-2.5">
                  {authRole === "doctor"
                    ? "Care begins with the right connection."
                    : "Healthcare that puts you first."}
                </h2>
                <p className="text-xs sm:text-[13px] text-neutral-200/90 leading-relaxed font-normal max-w-sm">
                  {authRole === "doctor"
                    ? "Professional access, multidisciplinary care teams, and patient coordination built for modern clinicians."
                    : "Connected specialists. Coordinated care. A healthcare experience designed around you."}
                </p>
              </div>

              {/* Three Compact Trust Indicators with Elegant Icons */}
              <div className="pt-4 border-t border-white/15 space-y-2.5">
                {authRole === "patient" ? (
                  <>
                    <div className="flex items-center gap-2.5 text-xs text-neutral-200/95">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                      <span className="font-medium tracking-wide">Trusted Specialist Network</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-neutral-200/95">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Lock className="w-3.5 h-3.5 text-sky-400" />
                      </span>
                      <span className="font-medium tracking-wide">Secure Patient Access</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-neutral-200/95">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Activity className="w-3.5 h-3.5 text-amber-300" />
                      </span>
                      <span className="font-medium tracking-wide">Coordinated Healthcare</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 text-xs text-neutral-200/95">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                      <span className="font-medium tracking-wide">Board-Verified Clinicians</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-neutral-200/95">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                      </span>
                      <span className="font-medium tracking-wide">Seamless EMR Integration</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-neutral-200/95">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                      </span>
                      <span className="font-medium tracking-wide">HIPAA & GDPR Aligned Platform</span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL – REFINED AUTHENTICATION EXPERIENCE (Desktop: 55%) */}
        {/* ============================================================== */}
        <div className="w-full md:w-[55%] h-full flex flex-col justify-between bg-white/75 dark:bg-[#111524]/85 backdrop-blur-2xl p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden relative text-neutral-900 dark:text-white">
          
          {/* 1. TOP HEADER (Brand mark / Role Back, Segmented Selector & Close) */}
          <div className="flex items-center justify-between shrink-0 mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              {authModalMode !== "select-role" ? (
                <button
                  type="button"
                  onClick={() => setAuthModalMode("select-role")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer group py-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <span>Choose Role</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 tracking-wider uppercase shadow-2xs">
                  <Lock className="w-3 h-3 text-[#7657ff]" /> SECURE PORTAL
                </span>
              )}
            </div>

            {/* Top Right: Segmented Role Controller & Close Button */}
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center bg-white/60 dark:bg-white/10 p-0.5 rounded-full border border-white/80 dark:border-white/15 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleSelectRole("patient", authModalMode === "select-role" ? "login" : authModalMode)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    authRole === "patient" && authModalMode !== "select-role"
                      ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-black shadow-xs font-bold"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRole("doctor", authModalMode === "select-role" ? "login" : authModalMode)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    authRole === "doctor" && authModalMode !== "select-role"
                      ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-black shadow-xs font-bold"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Doctor
                </button>
              </div>

              <button
                type="button"
                onClick={closeAuthModal}
                className="w-8 h-8 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* 2. MIDDLE FORM BODY (Vertically balanced & scrollable for long forms) */}
          <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 flex flex-col justify-center">

            {/* ========================================================== */}
            {/* VIEW A: ROLE SELECTION                                     */}
            {/* ========================================================== */}
            {authModalMode === "select-role" && (
              <div className="space-y-6 my-auto py-2">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 block mb-1.5">
                    MEDBRIDGE ACCESS
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 leading-tight">
                    Welcome to MedBridge Global
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 max-w-md">
                    Your healthcare journey starts here. Choose how you would like to continue.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {/* Patient Card */}
                  <div
                    onClick={() => handleSelectRole("patient", "login")}
                    className="group relative p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 text-neutral-800 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <User className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div>
                        <span className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-neutral-400 block mb-0.5">
                          PERSONAL CARE
                        </span>
                        <h3 className="text-base font-bold text-neutral-900">
                          Patient / Client
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Find doctors, manage appointments, and access your health records.
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all shrink-0 ml-3">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Doctor Card */}
                  <div
                    onClick={() => handleSelectRole("doctor", "login")}
                    className="group relative p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-neutral-100 group-hover:bg-neutral-900 text-neutral-800 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <Stethoscope className="w-5 h-5 stroke-[2]" />
                      </div>
                      <div>
                        <span className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-neutral-400 block mb-0.5">
                          CLINICAL PORTAL
                        </span>
                        <h3 className="text-base font-bold text-neutral-900">
                          Doctor / Healthcare Professional
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Manage consultations, patient interactions, and medical profiles.
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-all shrink-0 ml-3">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* VIEW B & C: LOGIN & REGISTRATION FORMS                     */}
            {/* ========================================================== */}
            {authModalMode !== "select-role" && (
              <div className="space-y-5 my-auto py-1">
                
                {/* Heading & Context Subtitle */}
                <div>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 block mb-1">
                    {authRole === "doctor" ? "DOCTOR PORTAL" : "PATIENT PORTAL"}
                  </span>
                  <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-neutral-900 leading-tight">
                    {authModalMode === "login"
                      ? authRole === "doctor"
                        ? "Welcome, Doctor."
                        : "Welcome back."
                      : authRole === "doctor"
                      ? "Doctor Registration"
                      : "Create Patient Account"}
                  </h1>
                  <p className="text-xs sm:text-[13.5px] text-neutral-500 mt-1">
                    {authModalMode === "login"
                      ? authRole === "doctor"
                        ? "Access your professional healthcare workspace."
                        : "Sign in to continue your healthcare journey."
                      : authRole === "doctor"
                      ? "Join the verified MedBridge specialist network."
                      : "Access verified specialists and coordinate your care."}
                  </p>
                </div>

                {/* Refined Tab Switcher (Sign In / Create Account) */}
                <div className="flex items-center gap-7 border-b border-neutral-200/80 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode("login");
                      setError(null);
                    }}
                    className={`pb-2.5 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                      authModalMode === "login"
                        ? "text-neutral-900"
                        : "text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    Sign In
                    {authModalMode === "login" && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode("register");
                      setError(null);
                    }}
                    className={`pb-2.5 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                      authModalMode === "register"
                        ? "text-neutral-900"
                        : "text-neutral-400 hover:text-neutral-700"
                    }`}
                  >
                    Create Account
                    {authModalMode === "register" && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-full" />
                    )}
                  </button>
                </div>

                {/* Validation Feedback & Alerts */}
                {error && (
                  <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/90 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}

                {forgotPasswordSent && (
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <span className="leading-relaxed">
                      Password reset instructions have been dispatched to <strong>{email}</strong>.
                    </span>
                  </div>
                )}

                {/* THE FORM */}
                <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                  
                  {/* --- REGISTRATION FIELDS --- */}
                  {authModalMode === "register" && (
                    <>
                      {/* Full Name */}
                      <div>
                        <label className="text-[12px] font-medium text-neutral-700 block mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center rounded-xl bg-[#FAF9F7] border border-neutral-200/90 focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all">
                          <User className="w-[18px] h-[18px] text-neutral-400 ml-3.5 shrink-0" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={authRole === "doctor" ? "Dr. Rajesh Sharma" : "Ananya Sharma"}
                            className="w-full h-[52px] px-3 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Doctor Specific: Two-column Specialization & License ID */}
                      {authRole === "doctor" && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[12px] font-medium text-neutral-700 block mb-1">
                                Medical Specialization <span className="text-red-500">*</span>
                              </label>
                              <div className="relative flex items-center rounded-xl bg-[#FAF9F7] border border-neutral-200/90 focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all">
                                <Stethoscope className="w-[18px] h-[18px] text-neutral-400 ml-3.5 shrink-0" />
                                <select
                                  value={specialization}
                                  onChange={(e) => setSpecialization(e.target.value)}
                                  className="w-full h-[52px] px-3 bg-transparent text-sm text-neutral-900 focus:outline-none cursor-pointer"
                                >
                                  {MEDICAL_SPECIALTIES.map((spec) => (
                                    <option key={spec} value={spec}>
                                      {spec}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-[12px] font-medium text-neutral-700 block mb-1">
                                Registration / License ID <span className="text-red-500">*</span>
                              </label>
                              <div className="relative flex items-center rounded-xl bg-[#FAF9F7] border border-neutral-200/90 focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all">
                                <ShieldCheck className="w-[18px] h-[18px] text-neutral-400 ml-3.5 shrink-0" />
                                <input
                                  type="text"
                                  required
                                  value={licenseNumber}
                                  onChange={(e) => setLicenseNumber(e.target.value)}
                                  placeholder="MCI-2024-88492"
                                  className="w-full h-[52px] px-3 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Refined Doctor Verification Pill */}
                          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F7F6F2] border border-[#EAE6DF] text-neutral-600 text-[11.5px] leading-relaxed">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>
                              Medical license credentials will be verified against the official medical council registry within 24 hours.
                            </span>
                          </div>
                        </>
                      )}

                      {/* Phone & Email (2 columns for registration) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[12px] font-medium text-neutral-700 block mb-1">
                            {authRole === "doctor" ? "Professional Email" : "Email Address"} <span className="text-red-500">*</span>
                          </label>
                          <div className="relative flex items-center rounded-xl bg-[#FAF9F7] border border-neutral-200/90 focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all">
                            <Mail className="w-[18px] h-[18px] text-neutral-400 ml-3.5 shrink-0" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder={authRole === "doctor" ? "doctor@clinic.com" : "name@example.com"}
                              className="w-full h-[52px] px-3 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[12px] font-medium text-neutral-700 block mb-1">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative flex items-center rounded-xl bg-[#FAF9F7] border border-neutral-200/90 focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all">
                            <Phone className="w-[18px] h-[18px] text-neutral-400 ml-3.5 shrink-0" />
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full h-[52px] px-3 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Password & Confirm Password (2 columns) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[12px] font-medium text-neutral-700 block mb-1">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative flex items-center rounded-xl bg-[#FAF9F7] border border-neutral-200/90 focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all">
                            <Lock className="w-[18px] h-[18px] text-neutral-400 ml-3.5 shrink-0" />
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full h-[52px] px-3 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[12px] font-medium text-neutral-700 block mb-1">
                            Confirm Password <span className="text-red-500">*</span>
                          </label>
                          <div className="relative flex items-center rounded-xl bg-[#FAF9F7] border border-neutral-200/90 focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all">
                            <Lock className="w-[18px] h-[18px] text-neutral-400 ml-3.5 shrink-0" />
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full h-[52px] px-3 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* --- LOGIN FIELDS --- */}
                  {authModalMode === "login" && (
                    <>
                      {/* Email Field */}
                      <div>
                        <label className="text-[12px] font-medium text-neutral-700 block mb-1.5">
                          {authRole === "doctor" ? "Professional Email or Phone" : "Email Address or Phone"} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative flex items-center rounded-xl bg-[#FAF9F7] border border-neutral-200/90 focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all">
                          <Mail className="w-[18px] h-[18px] text-neutral-400 ml-3.5 shrink-0" />
                          <input
                            type="text"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={authRole === "doctor" ? "doctor@medbridge.com" : "patient@medbridge.com"}
                            className="w-full h-[52px] px-3 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Password Field with Show/Hide & Forgot Password */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[12px] font-medium text-neutral-700">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-[11.5px] font-medium text-neutral-500 hover:text-black transition-colors cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative flex items-center rounded-xl bg-[#FAF9F7] border border-neutral-200/90 focus-within:border-neutral-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900/5 transition-all">
                          <Lock className="w-[18px] h-[18px] text-neutral-400 ml-3.5 shrink-0" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full h-[52px] px-3 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="pr-3.5 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Primary Charcoal Action Button (54px height) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-[54px] rounded-xl bg-[#121212] hover:bg-black text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-xs hover:shadow active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>
                            {authModalMode === "login"
                              ? authRole === "doctor"
                                ? "SIGN IN TO DOCTOR PORTAL"
                                : "SIGN IN AS PATIENT"
                              : authRole === "doctor"
                              ? "SUBMIT CLINICAL REGISTRATION"
                              : "CREATE PATIENT ACCOUNT"}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Understated Mode Switcher */}
                  <div className="text-center pt-2">
                    {authModalMode === "login" ? (
                      <p className="text-xs text-neutral-500">
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthModalMode("register");
                            setError(null);
                          }}
                          className="font-semibold text-neutral-900 hover:underline cursor-pointer ml-1"
                        >
                          Create an account
                        </button>
                      </p>
                    ) : (
                      <p className="text-xs text-neutral-500">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setAuthModalMode("login");
                            setError(null);
                          }}
                          className="font-semibold text-neutral-900 hover:underline cursor-pointer ml-1"
                        >
                          Sign in
                        </button>
                      </p>
                    )}
                  </div>

                </form>
              </div>
            )}

          </div>

          {/* 3. REFINED FOOTER (Security & Compliance Guarantee) */}
          <div className="pt-3.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
            <span className="inline-flex items-center gap-1.5 font-normal">
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              256-bit SSL Encrypted · Protected by MedBridge HealthGuard
            </span>
            <span className="text-[10.5px] text-neutral-400 font-medium">
              HIPAA & GDPR Aligned
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}

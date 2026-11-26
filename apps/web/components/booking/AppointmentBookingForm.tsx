"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SPECIALTIES_DATA,
  DOCTORS_DATA,
  AppointmentRecord,
  Doctor,
  SpecialtyData,
} from "@/lib/medical-data";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  Stethoscope,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Check,
  Printer,
  Copy,
  ExternalLink,
  CalendarPlus,
  Download,
  MapPin,
  Building,
  RotateCcw,
} from "lucide-react";

interface AppointmentBookingFormProps {
  initialSpecialtyId?: string;
  initialDoctorId?: string;
  onSuccess?: (appointment: AppointmentRecord) => void;
  onClose?: () => void;
}

const COUNTRY_CODES = [
  { code: "+1", label: "US / Canada (+1)", flag: "🇺🇸" },
  { code: "+91", label: "India (+91)", flag: "🇮🇳" },
  { code: "+44", label: "United Kingdom (+44)", flag: "🇬🇧" },
  { code: "+971", label: "UAE (+971)", flag: "🇦🇪" },
  { code: "+65", label: "Singapore (+65)", flag: "🇸🇬" },
  { code: "+61", label: "Australia (+61)", flag: "🇦🇺" },
  { code: "+49", label: "Germany (+49)", flag: "🇩🇪" },
  { code: "+33", label: "France (+33)", flag: "🇫🇷" },
  { code: "+81", label: "Japan (+81)", flag: "🇯🇵" },
  { code: "+41", label: "Switzerland (+41)", flag: "🇨🇭" },
  { code: "+966", label: "Saudi Arabia (+966)", flag: "🇸🇦" },
  { code: "+974", label: "Qatar (+974)", flag: "🇶🇦" },
];

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "11:30 AM",
  "01:30 PM",
  "02:30 PM",
  "03:30 PM",
  "04:30 PM",
  "05:30 PM",
];

const GENDER_OPTIONS = ["Female", "Male", "Other", "Prefer not to say"];

function getGoogleCalendarUrl(record: AppointmentRecord) {
  try {
    const [hoursStr, modifier] = record.timeSlot.split(" ");
    let [hours, minutes] = hoursStr.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const dateParts = record.date.split("-").map(Number);
    const startDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes || 0));
    const endDate = new Date(startDate.getTime() + 45 * 60 * 1000);

    const formatUtc = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const title = encodeURIComponent(`MedBridge: ${record.specialtyName} Consultation (${record.doctorName})`);
    const details = encodeURIComponent(
      `Appointment Ref: ${record.id}\nPatient: ${record.patientName}\nDepartment: ${record.specialtyName}\nDoctor: ${record.doctorName}\n\nMedBridge Global Health Pavilion`
    );
    const location = encodeURIComponent("MedBridge Global Health Pavilion");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatUtc(startDate)}/${formatUtc(endDate)}&details=${details}&location=${location}`;
  } catch {
    return "https://calendar.google.com/";
  }
}

function downloadIcsFile(record: AppointmentRecord) {
  try {
    const [hoursStr, modifier] = record.timeSlot.split(" ");
    let [hours, minutes] = hoursStr.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const dateParts = record.date.split("-").map(Number);
    const startDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes || 0));
    const endDate = new Date(startDate.getTime() + 45 * 60 * 1000);

    const formatUtc = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MedBridge Global//Appointment Booking//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:${record.id}@medbridgeglobal.com`,
      `DTSTAMP:${formatUtc(new Date())}`,
      `DTSTART:${formatUtc(startDate)}`,
      `DTEND:${formatUtc(endDate)}`,
      `SUMMARY:MedBridge Consultation: ${record.specialtyName} (${record.doctorName})`,
      `DESCRIPTION:Appointment Reference: ${record.id}\\nPatient: ${record.patientName}\\nSpecialty: ${record.specialtyName}\\nAttending Doctor: ${record.doctorName}`,
      "LOCATION:MedBridge Global Health Pavilion",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `MedBridge-${record.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to generate ICS file:", err);
  }
}

export default function AppointmentBookingForm({
  initialSpecialtyId,
  initialDoctorId,
  onSuccess,
  onClose,
}: AppointmentBookingFormProps) {
  // Wizard Step State (1: Specialist, 2: Details, 3: Schedule)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Specialist Selection
  const [specialtyId, setSpecialtyId] = useState(
    initialSpecialtyId || "internal-medicine"
  );
  const [doctorId, setDoctorId] = useState(initialDoctorId || "");

  // Step 2: Patient Information
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("");

  // Step 3: Date & Time Scheduling
  const initialDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const [selectedDate, setSelectedDate] = useState(initialDateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 AM");
  const [consultationReason, setConsultationReason] = useState("");

  // Calendar navigation state
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Dynamic slot availability
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Form Submission & Validation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [confirmedRecord, setConfirmedRecord] = useState<AppointmentRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Data Lookups
  const selectedSpecialty = SPECIALTIES_DATA[specialtyId];
  const availableDoctors = useMemo(() => {
    return DOCTORS_DATA.filter((doc) => !specialtyId || doc.specialtyId === specialtyId);
  }, [specialtyId]);

  const selectedDoctor = useMemo(() => {
    return DOCTORS_DATA.find((doc) => doc.id === doctorId);
  }, [doctorId]);

  // Fetch booked slots whenever selectedDate or doctorId changes
  useEffect(() => {
    if (!selectedDate) return;
    let isCancelled = false;

    async function fetchBookedSlots() {
      setIsLoadingSlots(true);
      try {
        const query = new URLSearchParams({
          date: selectedDate,
          doctorId: doctorId || "first-available",
        });
        const res = await fetch(`/api/appointments?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && Array.isArray(data.bookedSlots)) {
            setBookedSlots(data.bookedSlots);
            if (data.bookedSlots.includes(selectedTimeSlot)) {
              const nextOpen = TIME_SLOTS.find((s) => !data.bookedSlots.includes(s));
              if (nextOpen) setSelectedTimeSlot(nextOpen);
            }
          }
        }
      } catch (err) {
        console.error("Failed to check slot availability:", err);
      } finally {
        if (!isCancelled) setIsLoadingSlots(false);
      }
    }

    fetchBookedSlots();
    return () => {
      isCancelled = true;
    };
  }, [selectedDate, doctorId]);

  // Handle Step 1 Validation & Next
  const handleStep1Next = () => {
    setErrorMessage("");
    if (!specialtyId) {
      setErrorMessage("Please select a medical specialty to continue.");
      return;
    }
    setCurrentStep(2);
  };

  // Handle Step 2 Validation & Next
  const handleStep2Next = () => {
    setErrorMessage("");
    const errors: { [key: string]: string } = {};

    if (!patientName.trim() || patientName.trim().length < 2) {
      errors.name = "Full name is required (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patientEmail.trim() || !emailRegex.test(patientEmail.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    const digitsOnly = patientPhone.replace(/\D/g, "");
    if (!digitsOnly || digitsOnly.length < 7) {
      errors.phone = "Please enter a valid phone number (at least 7 digits).";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage("Please complete all required fields accurately.");
      return;
    }

    setCurrentStep(3);
  };

  // Handle Final Submission (Step 3)
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    if (!selectedDate) {
      setErrorMessage("Please select your consultation date.");
      return;
    }

    if (!selectedTimeSlot) {
      setErrorMessage("Please select a consultation time slot.");
      return;
    }

    if (bookedSlots.includes(selectedTimeSlot)) {
      setErrorMessage("The selected time slot was just booked. Please choose another slot.");
      return;
    }

    setIsSubmitting(true);

    try {
      const fullPhone = `${countryCode} ${patientPhone.trim()}`;
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: patientName.trim(),
          patientEmail: patientEmail.trim().toLowerCase(),
          patientPhone: fullPhone,
          specialtyId,
          specialtyName: selectedSpecialty ? selectedSpecialty.name : "General Consultation",
          doctorId: selectedDoctor ? selectedDoctor.id : "first-available",
          doctorName: selectedDoctor ? selectedDoctor.name : "First Available Specialist",
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          reason: consultationReason.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to schedule appointment.");
      }

      setConfirmedRecord(data.appointment);
      if (onSuccess) {
        onSuccess(data.appointment);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferenceCode = () => {
    if (!confirmedRecord) return;
    navigator.clipboard.writeText(confirmedRecord.id);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  // Calendar Month Computation
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      day: number;
      dateStr: string;
      isPast: boolean;
      isSelected: boolean;
      isToday: boolean;
    }> = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      dateObj.setHours(0, 0, 0, 0);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      days.push({
        day: d,
        dateStr,
        isPast: dateObj < today,
        isSelected: dateStr === selectedDate,
        isToday: dateObj.getTime() === today.getTime(),
      });
    }

    return { firstDay, days };
  }, [viewDate, selectedDate]);

  const canGoPrevMonth = useMemo(() => {
    const today = new Date();
    return (
      viewDate.getFullYear() > today.getFullYear() ||
      (viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() > today.getMonth())
    );
  }, [viewDate]);

  // -------------------------------------------------------------
  // STEP 4: ELEVATED DIGITAL HEALTHCARE CONSULTATION PASS
  // -------------------------------------------------------------
  if (confirmedRecord) {
    const patientFirstName = confirmedRecord.patientName.trim().split(" ")[0];
    const googleCalendarUrl = getGoogleCalendarUrl(confirmedRecord);

    return (
      <div className="py-1 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Celebration Header */}
        <div className="text-center pb-5">
          <div className="relative mx-auto mb-3 w-14 h-14 rounded-full bg-emerald-50 ring-6 ring-emerald-50/70 flex items-center justify-center text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 text-[10.5px] font-bold tracking-wider uppercase mb-1.5">
            <Check className="w-3 h-3 text-emerald-700 stroke-[2.5]" />
            <span>Consultation Confirmed</span>
          </div>

          <h2 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#080808]">
            You&rsquo;re all set, {patientFirstName}!
          </h2>
          <p className="text-xs sm:text-[13px] text-neutral-500 mt-1 max-w-md mx-auto leading-relaxed">
            Your visit has been confirmed. A calendar invitation and clinic instructions have been sent to{" "}
            <span className="font-semibold text-neutral-800">{confirmedRecord.patientEmail}</span>.
          </p>
        </div>

        {/* Digital Consultation Boarding Pass */}
        <div className="rounded-[22px] bg-white border border-neutral-200 shadow-sm overflow-hidden mb-5">
          {/* Pass Top Banner */}
          <div className="bg-[#0f0f0f] text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-neutral-300">
                OFFICIAL CONSULTATION PASS
              </span>
            </div>

            {/* Prominent Reference Tag */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">
                REF:
              </span>
              <span className="font-mono font-bold text-xs sm:text-[13px] text-emerald-300 tracking-wider">
                {confirmedRecord.id}
              </span>
              <button
                type="button"
                onClick={copyReferenceCode}
                className="ml-1 text-neutral-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                title="Copy Reference"
              >
                {copiedRef ? (
                  <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Pass Body */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Doctor Profile Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3.5">
                {selectedDoctor ? (
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200 shadow-2xs">
                    <Image
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0 border border-neutral-200">
                    <Stethoscope className="w-6 h-6 text-neutral-800" />
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500 block mb-0.5">
                    {confirmedRecord.specialtyName}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                    {confirmedRecord.doctorName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      MedBridge Global Health Pavilion
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[10.5px] font-semibold">
                  <Building className="w-3 h-3 text-neutral-600" />
                  In-Clinic Consultation
                </span>
              </div>
            </div>

            {/* 4-Cell Itinerary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {/* Date */}
              <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-neutral-900">
                  {new Date(confirmedRecord.date + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {new Date(confirmedRecord.date + "T00:00:00").getFullYear()}
                </div>
              </div>

              {/* Time Window */}
              <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Time Window</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-neutral-900">
                  {confirmedRecord.timeSlot}
                </div>
                <div className="text-[10px] text-neutral-400">45-min unhurried visit</div>
              </div>

              {/* Patient */}
              <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Patient</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-neutral-900 truncate">
                  {confirmedRecord.patientName}
                </div>
                <div className="text-[10px] text-neutral-400 truncate">Verified Profile</div>
              </div>

              {/* Contact */}
              <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Contact Phone</span>
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-neutral-900 truncate">
                  {confirmedRecord.patientPhone}
                </div>
                <div className="text-[10px] text-neutral-400">SMS Reminders Active</div>
              </div>
            </div>

            {/* Policy & Trust Indicators */}
            <div className="pt-2 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-neutral-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                <span>Zero Upfront Fee (Billed at intake)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                <span>Free Rescheduling up to 4h prior</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Digital Check-in 24h before visit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add to Calendar Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 mb-5">
          <div className="flex items-center gap-2 text-xs text-neutral-700 font-medium">
            <CalendarPlus className="w-4 h-4 text-neutral-900" />
            <span>Sync consultation to your calendar:</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 text-xs font-semibold transition-colors shadow-2xs"
            >
              <span>Google Calendar</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>

            <button
              type="button"
              onClick={() => downloadIcsFile(confirmedRecord)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3 h-3 text-neutral-500" />
              <span>Apple / Outlook (.ics)</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2.5">
            <Link
              href={`/appointments?email=${encodeURIComponent(confirmedRecord.patientEmail)}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <span>View in My Appointments</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // WIZARD STEPS (1, 2, 3)
  // -------------------------------------------------------------
  return (
    <div className="text-left text-neutral-900 dark:text-white">
      {/* Wizard Heading */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Book Your Appointment
          </h2>
          <div className="hidden sm:inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/60 dark:bg-white/10 text-[#7657ff] dark:text-[#a99aff]">
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>
        </div>
        <p className="text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 mt-0.5">
          Find the right specialist and choose your preferred time.
        </p>
      </div>

      {/* 1. Interactive 3-Step Wizard Header */}
      <div className="border-b border-neutral-200/60 dark:border-white/10 pb-4 mb-5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Step 1 Indicator */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 text-xs font-semibold tracking-wide transition-all ${
              currentStep === 1
                ? "text-black dark:text-white"
                : "text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                currentStep === 1
                  ? "bg-[#7657ff] text-white shadow-xs"
                  : currentStep > 1
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-black"
                  : "bg-neutral-100 dark:bg-white/10 text-neutral-500 dark:text-neutral-400"
              }`}
            >
              {currentStep > 1 ? "✓" : "1"}
            </span>
            <span className="hidden sm:inline">01 Specialist</span>
            <span className="sm:hidden">Specialist</span>
          </button>

          <div
            className={`h-[1.5px] flex-1 transition-colors duration-300 ${
              currentStep > 1 ? "bg-[#7657ff]" : "bg-neutral-200 dark:bg-white/10"
            }`}
          />

          {/* Step 2 Indicator */}
          <button
            type="button"
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            disabled={currentStep < 2}
            className={`flex items-center gap-2 text-xs font-semibold tracking-wide transition-all ${
              currentStep === 2
                ? "text-black dark:text-white"
                : currentStep > 2
                ? "text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
                : "text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                currentStep === 2
                  ? "bg-[#7657ff] text-white shadow-xs"
                  : currentStep > 2
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-black"
                  : "bg-neutral-100 dark:bg-white/10 text-neutral-400"
              }`}
            >
              {currentStep > 2 ? "✓" : "2"}
            </span>
            <span className="hidden sm:inline">02 Details</span>
            <span className="sm:hidden">Details</span>
          </button>

          <div
            className={`h-[1.5px] flex-1 transition-colors duration-300 ${
              currentStep > 2 ? "bg-[#7657ff]" : "bg-neutral-200 dark:bg-white/10"
            }`}
          />

          {/* Step 3 Indicator */}
          <button
            type="button"
            disabled={currentStep < 3}
            className={`flex items-center gap-2 text-xs font-semibold tracking-wide transition-all ${
              currentStep === 3
                ? "text-black dark:text-white"
                : "text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                currentStep === 3
                  ? "bg-[#7657ff] text-white shadow-xs"
                  : "bg-neutral-100 dark:bg-white/10 text-neutral-400"
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">03 Schedule</span>
            <span className="sm:hidden">Schedule</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 01: CHOOSE YOUR SPECIALIST                               */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 1 && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Select Medical Department
              </label>
              <span className="text-[11px] text-neutral-400 font-medium">
                8 Specialty Disciplines
              </span>
            </div>

            {/* Compact Specialty Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(SPECIALTIES_DATA).map((spec) => {
                const isSelected = specialtyId === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => {
                      setSpecialtyId(spec.id);
                      setDoctorId("");
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white shadow-xs ring-1 ring-black"
                        : "border-neutral-200/80 bg-white hover:border-neutral-400 text-neutral-800 hover:bg-neutral-50/70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Stethoscope
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-white" : "text-neutral-500"
                        }`}
                      />
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold leading-tight line-clamp-1">
                        {spec.name}
                      </h4>
                      <p
                        className={`text-[10px] mt-0.5 line-clamp-1 ${
                          isSelected ? "text-neutral-300" : "text-neutral-500"
                        }`}
                      >
                        {spec.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                Preferred Physician
              </label>
              <span className="text-[11px] text-neutral-500 font-medium">
                {availableDoctors.length} specialists available in {selectedSpecialty?.name}
              </span>
            </div>

            <div className="relative">
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs sm:text-[13px] text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black appearance-none transition-all shadow-2xs font-medium cursor-pointer"
              >
                <option value="">⚡ First Available Specialist (Recommended — Shortest Wait)</option>
                {availableDoctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} • {doc.experienceYears}y exp • {doc.hospitalAffiliation}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Doctor Profile Spotlight Preview */}
            {selectedDoctor ? (
              <div className="mt-3 p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 flex items-start gap-3.5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 shrink-0 border border-white shadow-2xs">
                  <Image
                    src={selectedDoctor.image}
                    alt={selectedDoctor.name}
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-[13px] font-bold text-neutral-900">
                      {selectedDoctor.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9.5px] font-bold tracking-wider uppercase">
                      Verified Specialist
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    {selectedDoctor.title}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10.5px] text-neutral-600 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {selectedDoctor.experienceYears}+ Years Exp
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      ★ {selectedDoctor.rating} ({selectedDoctor.reviewsCount} reviews)
                    </span>
                    <span>•</span>
                    <span className="text-neutral-500">
                      {selectedDoctor.availability}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 p-3 rounded-xl bg-neutral-50/70 border border-neutral-100 flex items-center gap-2.5 text-xs text-neutral-600">
                <Sparkles className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>
                  <strong>Fast-Track Consultation:</strong> Our clinical coordinators will pair you with the earliest available board-certified {selectedSpecialty?.name || "specialist"} consultant.
                </span>
              </div>
            )}
          </div>

          {/* Step 1 Actions */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">
              Step 1 of 3 — Specialist Selection
            </span>
            <button
              type="button"
              onClick={handleStep1Next}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
            >
              <span>Continue to Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 02: PATIENT INFORMATION                                  */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Patient Contact & Identity
            </label>
            <span className="text-[11px] text-neutral-400">
              * Required fields
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={patientName}
                  onChange={(e) => {
                    setPatientName(e.target.value);
                    if (fieldErrors.name) {
                      setFieldErrors((prev) => ({ ...prev, name: "" }));
                    }
                  }}
                  className={`w-full pl-8.5 pr-3 py-2.5 rounded-xl border text-xs sm:text-[13px] bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 transition-all shadow-2xs font-medium ${
                    fieldErrors.name
                      ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                      : "border-neutral-300 focus:ring-black focus:border-black"
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <span className="text-[10.5px] text-red-600 mt-1 block">
                  {fieldErrors.name}
                </span>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={patientEmail}
                  onChange={(e) => {
                    setPatientEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  className={`w-full pl-8.5 pr-3 py-2.5 rounded-xl border text-xs sm:text-[13px] bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 transition-all shadow-2xs font-medium ${
                    fieldErrors.email
                      ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                      : "border-neutral-300 focus:ring-black focus:border-black"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <span className="text-[10.5px] text-red-600 mt-1 block">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Phone Number with Country Code */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Phone Number *
              </label>
              <div className="flex gap-2">
                <div className="relative shrink-0 w-36 sm:w-44">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full pl-2.5 pr-7 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black appearance-none font-medium cursor-pointer shadow-2xs"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.label.split(" ")[0]})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative flex-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={patientPhone}
                    onChange={(e) => {
                      setPatientPhone(e.target.value);
                      if (fieldErrors.phone) {
                        setFieldErrors((prev) => ({ ...prev, phone: "" }));
                      }
                    }}
                    className={`w-full pl-8.5 pr-3 py-2.5 rounded-xl border text-xs sm:text-[13px] bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 transition-all shadow-2xs font-medium ${
                      fieldErrors.phone
                        ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                        : "border-neutral-300 focus:ring-black focus:border-black"
                    }`}
                  />
                </div>
              </div>
              {fieldErrors.phone && (
                <span className="text-[10.5px] text-red-600 mt-1 block">
                  {fieldErrors.phone}
                </span>
              )}
            </div>

            {/* Optional Age */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Age <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                max="125"
                placeholder="e.g. 42"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs sm:text-[13px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-2xs font-medium"
              />
            </div>

            {/* Optional Gender Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                Gender <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {GENDER_OPTIONS.map((g) => {
                  const isSelected = patientGender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPatientGender(isSelected ? "" : g)}
                      className={`px-3 py-2 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-black text-white border-black font-semibold shadow-2xs"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Specialist</span>
            </button>

            <button
              type="button"
              onClick={handleStep2Next}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 03: SCHEDULE YOUR APPOINTMENT                            */}
      {/* ------------------------------------------------------------- */}
      {currentStep === 3 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left: Interactive Calendar */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Select Consultation Date
                </label>
                <span className="text-[11px] text-neutral-500 font-medium">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Monthly Calendar Card */}
              <div className="p-3 sm:p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/80">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h4 className="text-xs font-bold text-neutral-900 tracking-tight">
                    {viewDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={!canGoPrevMonth}
                      onClick={() =>
                        setViewDate(
                          new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
                        )
                      }
                      className="p-1 rounded-md text-neutral-600 hover:text-black hover:bg-neutral-200/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setViewDate(
                          new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
                        )
                      }
                      className="p-1 rounded-md text-neutral-600 hover:text-black hover:bg-neutral-200/60 transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-bold text-neutral-400">
                  <span>Su</span>
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: calendarDays.firstDay }).map((_, i) => (
                    <div key={`blank-${i}`} className="h-7" />
                  ))}

                  {calendarDays.days.map((item) => (
                    <button
                      key={item.dateStr}
                      type="button"
                      disabled={item.isPast}
                      onClick={() => setSelectedDate(item.dateStr)}
                      className={`h-7 rounded-lg text-[11px] flex items-center justify-center transition-all ${
                        item.isPast
                          ? "text-neutral-300 cursor-not-allowed"
                          : item.isSelected
                          ? "bg-black text-white font-bold shadow-2xs scale-105"
                          : "text-neutral-800 hover:bg-neutral-200/70 font-medium cursor-pointer"
                      }`}
                    >
                      {item.day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Select Shortcuts */}
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Quick:
                </span>
                {[
                  { label: "Tomorrow", offset: 1 },
                  { label: "+2 Days", offset: 2 },
                  { label: "+3 Days", offset: 3 },
                  { label: "+1 Week", offset: 7 },
                ].map((q) => {
                  const target = new Date();
                  target.setDate(target.getDate() + q.offset);
                  const str = target.toISOString().split("T")[0];
                  const isCurrent = selectedDate === str;
                  return (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => {
                        setSelectedDate(str);
                        setViewDate(new Date(target.getFullYear(), target.getMonth(), 1));
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors cursor-pointer ${
                        isCurrent
                          ? "bg-neutral-900 text-white border-black font-semibold"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      {q.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Time Slots & Notes */}
            <div className="lg:col-span-6 space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Available Time Slot
                  </label>
                  {isLoadingSlots ? (
                    <span className="text-[10.5px] text-neutral-400 animate-pulse">
                      Checking availability...
                    </span>
                  ) : (
                    <span className="text-[10.5px] text-emerald-800 font-medium">
                      ● Live Slots
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    const isBooked = bookedSlots.includes(slot);

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-1 rounded-xl text-[11px] border text-center transition-all flex items-center justify-center gap-1 ${
                          isBooked
                            ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed line-through opacity-60"
                            : isSelected
                            ? "bg-black text-white border-black font-bold shadow-xs ring-1 ring-black cursor-pointer"
                            : "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/70 font-medium cursor-pointer"
                        }`}
                      >
                        <Clock className="w-2.5 h-2.5 shrink-0 opacity-70" />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Reason (Optional) */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Reason for Consultation{" "}
                  <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief notes, symptoms, or health goals for the physician..."
                  value={consultationReason}
                  onChange={(e) => setConsultationReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-2xs resize-none"
                />
              </div>

              {/* Live Mini Summary Panel */}
              <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-200/80 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-neutral-600">
                  <span className="text-neutral-400">Specialty:</span>
                  <span className="font-semibold text-neutral-900">
                    {selectedSpecialty?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-600">
                  <span className="text-neutral-400">Doctor:</span>
                  <span className="font-semibold text-neutral-900">
                    {selectedDoctor ? selectedDoctor.name : "First Available"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-600">
                  <span className="text-neutral-400">Scheduled:</span>
                  <span className="font-semibold text-neutral-900">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {selectedTimeSlot}
                  </span>
                </div>
                {patientName && (
                  <div className="flex items-center justify-between text-neutral-600">
                    <span className="text-neutral-400">Patient:</span>
                    <span className="font-semibold text-neutral-900">
                      {patientName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3 Actions */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Details</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-full bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 disabled:bg-neutral-400 transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM APPOINTMENT →</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

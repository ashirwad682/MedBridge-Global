"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Image from "next/image";
import AppointmentBookingForm from "./AppointmentBookingForm";
import { X } from "lucide-react";

interface BookingOptions {
  specialtyId?: string;
  doctorId?: string;
}

interface BookingContextType {
  openBooking: (options?: BookingOptions) => void;
  closeBooking: () => void;
  isOpen: boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<BookingOptions>({});

  const openBooking = (opts?: BookingOptions) => {
    setOptions(opts || {});
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
  };

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking, isOpen }}>
      {children}

      {/* Global Booking Glass Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop with realistic blur */}
          <div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={closeBooking}
          />

          {/* Modal Container: Frosted glass rounded-[32px] */}
          <div className="relative w-full max-w-[840px] max-h-[92vh] bg-white/90 dark:bg-[#101420]/95 backdrop-blur-3xl rounded-[28px] sm:rounded-[32px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.3)] p-5 sm:p-7 md:p-8 z-10 my-auto overflow-y-auto animate-in zoom-in-95 duration-200 border border-white/80 dark:border-white/15">
            {/* Top Bar with Brand Logo and Close Button */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-200/60 dark:border-white/10">
              <div className="flex items-center gap-2">
                {/* Light mode logo */}
                <Image
                  src="/images/medbridge-logo.png"
                  alt="MedBridge"
                  width={927}
                  height={193}
                  priority
                  className="h-6 sm:h-[26px] w-auto object-contain dark:hidden"
                />
                {/* Dark mode logo */}
                <Image
                  src="/images/medbridge-logo-white.png"
                  alt="MedBridge"
                  width={927}
                  height={193}
                  priority
                  className="h-6 sm:h-[26px] w-auto object-contain hidden dark:block"
                />
              </div>

              <button
                onClick={closeBooking}
                className="w-8 h-8 rounded-full bg-white/70 dark:bg-white/10 hover:bg-neutral-100 dark:hover:bg-white/20 border border-white/80 dark:border-white/15 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reusable Form */}
            <AppointmentBookingForm
              initialSpecialtyId={options.specialtyId}
              initialDoctorId={options.doctorId}
              onClose={closeBooking}
            />
          </div>
        </div>
      )}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}

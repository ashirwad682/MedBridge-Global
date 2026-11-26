"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  LogOut,
  Stethoscope,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { useBooking } from "@/components/booking/BookingContext";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function Navbar() {
  const { user, openAuthModal, logout } = useAuth();
  const { openBooking } = useBooking();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ease-out ${
        isScrolled ? "pt-2 sm:pt-2.5" : "pt-3 sm:pt-4 md:pt-5"
      }`}
    >
      <div className="w-[92%] sm:w-[88%] md:w-[84%] lg:w-[78%] xl:w-[72%] max-w-[1060px] pointer-events-auto">
        <nav
          aria-label="Main Navigation"
          className={`relative flex items-center justify-between rounded-full bg-white/65 dark:bg-black/35 backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_12px_36px_-8px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 ease-out px-3.5 sm:px-5 md:px-6 ${
            isScrolled ? "h-[52px] sm:h-[54px] md:h-[56px]" : "h-[58px] sm:h-[60px] md:h-[62px]"
          }`}
        >
          {/* Brand Logo (Left) */}
          <Link
            href="/"
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-full shrink-0 py-1"
            aria-label="MedBridge Home"
          >
            {/* Light Mode Logo */}
            <Image
              src="/images/medbridge-logo.png"
              alt="MedBridge"
              width={927}
              height={193}
              priority
              className={`w-auto object-contain transition-all duration-300 dark:hidden ${
                isScrolled
                  ? "h-[22px] sm:h-[24px] md:h-[25px] lg:h-[27px]"
                  : "h-[25px] sm:h-[27px] md:h-[29px] lg:h-[31px]"
              }`}
            />
            {/* Dark Mode Logo */}
            <Image
              src="/images/medbridge-logo-white.png"
              alt="MedBridge"
              width={927}
              height={193}
              priority
              className={`w-auto object-contain transition-all duration-300 hidden dark:block ${
                isScrolled
                  ? "h-[22px] sm:h-[24px] md:h-[25px] lg:h-[27px]"
                  : "h-[25px] sm:h-[27px] md:h-[29px] lg:h-[31px]"
              }`}
            />
          </Link>

          {/* Desktop Center Links (Centered horizontally & vertically) */}
          <ul
            className={`hidden md:flex items-center font-medium text-neutral-600 dark:text-neutral-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              isScrolled ? "gap-2.5 lg:gap-4 text-[11.5px] lg:text-[12px]" : "gap-3 lg:gap-4.5 text-[12px] lg:text-[12.5px]"
            }`}
          >
            {SITE_CONFIG.navLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-neutral-950 dark:hover:text-white px-2.5 py-1 rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-200 tracking-normal focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center shrink-0 gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="w-8 h-8 rounded-full bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-white/70 dark:border-white/15 text-neutral-700 dark:text-neutral-200 flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              {theme === "light" ? (
                <Moon className="w-3.5 h-3.5 transition-transform duration-300 hover:-rotate-12" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform duration-300 hover:rotate-45" />
              )}
            </button>

            {!user ? (
              <>
                {/* Minimal Log In Text Button */}
                <button
                  type="button"
                  onClick={() => openAuthModal("login", "patient")}
                  className={`font-semibold text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors duration-200 cursor-pointer rounded-full hover:bg-white/40 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                    isScrolled ? "text-[11px] px-2.5 py-1.5" : "text-xs px-3 py-1.5"
                  }`}
                >
                  Log In
                </button>

                {/* Minimalist Glass Get Started Button */}
                <button
                  type="button"
                  onClick={() => openAuthModal("select-role")}
                  className={`inline-flex items-center justify-center font-semibold rounded-full bg-[#0a0a0a] hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 cursor-pointer whitespace-nowrap ${
                    isScrolled
                      ? "text-[11px] px-3.5 py-1.5"
                      : "text-xs px-4 md:px-5 py-2"
                  }`}
                >
                  Get Started
                </button>
              </>
            ) : (
              /* Authenticated User Profile Dropdown */
              <div className="relative" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-white/70 dark:border-white/15 bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/15 transition-all cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-[10px] font-bold">
                    {user.avatar || user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 max-w-[90px] lg:max-w-[110px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      user.role === "doctor"
                        ? "bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300"
                        : "bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-200"
                    }`}
                  >
                    {user.role === "doctor" ? "Dr." : "Patient"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Glass Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white/85 dark:bg-[#12151e]/90 backdrop-blur-2xl border border-white/80 dark:border-white/12 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.7)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-neutral-100 dark:border-white/10 mb-1">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[10.5px] text-neutral-500 dark:text-neutral-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href={user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                      <span>{user.role === "doctor" ? "Doctor Dashboard" : "Patient Portal"}</span>
                    </Link>

                    <Link
                      href="/appointments"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                      <span>Appointments & Records</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        openBooking();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-colors text-left cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                      <span>Book New Appointment</span>
                    </button>

                    <div className="my-1 border-t border-neutral-100 dark:border-white/10" />

                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Actions: Theme Toggle + Menu */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="w-7 h-7 rounded-full bg-white/50 dark:bg-white/10 border border-white/70 dark:border-white/15 text-neutral-700 dark:text-neutral-200 flex items-center justify-center text-xs"
            >
              {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
            </button>

            {!user ? (
              <button
                type="button"
                onClick={() => openAuthModal("select-role")}
                className={`inline-flex items-center justify-center font-semibold rounded-full bg-[#0a0a0a] text-white dark:bg-white dark:text-black transition-all duration-300 cursor-pointer ${
                  isScrolled ? "text-[10px] px-3 py-1.5" : "text-[11px] px-3.5 py-1.5"
                }`}
              >
                Get Started
              </button>
            ) : (
              <Link
                href={user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"}
                className="w-7 h-7 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-bold"
              >
                {user.avatar || user.name.slice(0, 2).toUpperCase()}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-1.5 rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Glass Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-5 rounded-[24px] bg-white/80 dark:bg-[#10131c]/85 backdrop-blur-2xl border border-white/80 dark:border-white/15 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300">
            <ul className="flex flex-col space-y-3 text-[14px] font-medium text-neutral-700 dark:text-neutral-300">
              {SITE_CONFIG.navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                </li>
              ))}

              <li className="pt-2 border-t border-neutral-200/60 dark:border-white/10 flex flex-col gap-2">
                {!user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal("login", "patient");
                      }}
                      className="w-full py-2.5 rounded-xl border border-white/80 dark:border-white/15 bg-white/50 dark:bg-white/10 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-white/80 dark:hover:bg-white/15 transition-colors"
                    >
                      Log In (Patient or Doctor)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal("select-role");
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#0a0a0a] text-white dark:bg-white dark:text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                      Get Started
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/40 dark:bg-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-white">{user.name}</p>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{user.email}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-white/20 text-neutral-800 dark:text-neutral-200 uppercase">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href={user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full block text-center py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider"
                    >
                      Open {user.role === "doctor" ? "Doctor Dashboard" : "Patient Portal"}
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

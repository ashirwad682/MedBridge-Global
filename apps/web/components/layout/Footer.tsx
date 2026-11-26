import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-white/40 dark:bg-[#07090f]/70 backdrop-blur-3xl text-neutral-600 dark:text-neutral-400 pt-14 pb-10 border-t border-white/80 dark:border-white/10 transition-colors duration-500 scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-Column Balanced Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-neutral-200/60 dark:border-white/10">
          {/* Column 1: Brand (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <Link href="/" className="inline-flex items-center" aria-label="MedBridge Home">
              {/* Light Mode Logo */}
              <Image
                src="/images/medbridge-logo.png"
                alt="MedBridge"
                width={927}
                height={193}
                className="h-7 sm:h-8 md:h-[30px] w-auto object-contain dark:hidden"
              />
              {/* Dark Mode Logo */}
              <Image
                src="/images/medbridge-logo-white.png"
                alt="MedBridge"
                width={927}
                height={193}
                className="h-7 sm:h-8 md:h-[30px] w-auto object-contain hidden dark:block"
              />
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed max-w-sm">
              Connecting trusted medical specialists, diagnostics, and modern healthcare coordination for an elevated patient journey.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/[0.06] border border-white/80 dark:border-white/12 shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-[#7657ff] dark:text-[#a99aff]" />
                Global Network
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/[0.06] border border-white/80 dark:border-white/12 shadow-2xs">
                <Shield className="w-3.5 h-3.5 text-[#7657ff] dark:text-[#a99aff]" />
                HIPAA Aligned
              </span>
            </div>
          </div>

          {/* Column 2: Platform (2-3 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-900 dark:text-white">
              Platform
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#specialties" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Specialties
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Doctors Directory
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Patient Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Specialties (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-900 dark:text-white">
              Specialties
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/specialties/internal-medicine" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Internal Medicine
                </Link>
              </li>
              <li>
                <Link href="/specialties/cardiology" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Cardiology & Vascular
                </Link>
              </li>
              <li>
                <Link href="/specialties/orthopedics" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Orthopedics & Spine
                </Link>
              </li>
              <li>
                <Link href="/specialties/neurology" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Neurology & Brain Health
                </Link>
              </li>
              <li>
                <Link href="/specialties/dermatology" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Dermatology
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Organization (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-900 dark:text-white">
              Organization
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/#about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Schedule Consultation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:contact@medbridgeglobal.care" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  contact@medbridgeglobal.care
                </a>
              </li>
              <li>
                <a href="tel:+18004152273" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  +1 (800) 415-CARE
                </a>
              </li>
              <li>
                <span className="text-neutral-500 text-[11px]">MedBridge Global Health Pavilion</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Compact & Clean */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 gap-3">
          <p>© 2026 Ashirwad Kumar. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-of-service" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <span className="text-neutral-400 dark:text-neutral-600">Demonstrative Clinical Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

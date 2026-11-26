import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ShieldAlert,
  FileText,
  Lock,
  Globe,
  AlertTriangle,
  Mail,
  ChevronRight,
  Code2,
  CheckCircle2,
  Scale,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Intellectual Property Policy | MedBridge Global",
  description:
    "Comprehensive Intellectual Property Policy governing the proprietary technologies, trademarks, patents, software designs, and DMCA compliance for MedBridge Global.",
};

export default function IntellectualPropertyPage() {
  const sections = [
    { id: "overview", label: "1. Policy Overview & Ownership" },
    { id: "trademarks", label: "2. Trademarks & Brand Emblems" },
    { id: "software-ip", label: "3. Proprietary Software & Architecture" },
    { id: "prohibited", label: "4. Strictly Prohibited Activities" },
    { id: "dmca-process", label: "5. DMCA & Infringement Claims" },
    { id: "counter-notice", label: "6. Counter-Notification Procedure" },
    { id: "enforcement", label: "7. Legal Enforcement & Remedies" },
    { id: "contact", label: "8. Designated Agent Contact" },
  ];

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#7657ff] dark:text-[#a99aff] text-[11px] font-bold tracking-[0.16em] uppercase mb-4">
              <Scale className="w-3.5 h-3.5" />
              IP GOVERNANCE & COMPLIANCE
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-4">
              Intellectual Property Policy
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Guidelines, legal rights, trademark protections, and copyright enforcement standards established by <strong>Ashirwad Kumar</strong> for the MedBridge Global healthcare ecosystem.
            </p>
          </div>

          {/* Quick Highlight Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Primary Rights Holder
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                Ashirwad Kumar
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Protection Framework
              </span>
              <span className="text-sm sm:text-base font-bold text-[#7657ff] mt-1 block">
                DMCA & Berne Convention
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Trademarks
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block truncate">
                MedBridge / MedBridge Global
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Agent Contact
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block truncate">
                ashirwadkumar.dev@...
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pb-24">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Sticky Table of Contents Sidebar */}
            <aside className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-28 p-6 rounded-3xl bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <span className="text-xs font-bold tracking-[0.14em] uppercase text-neutral-400 block">
                  Contents
                </span>
                <nav className="space-y-1 text-xs">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-neutral-100/80 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-all group font-medium"
                    >
                      <span>{sec.label}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#7657ff]" />
                    </a>
                  ))}
                </nav>

                <div className="pt-4 border-t border-neutral-200/50 dark:border-white/10 space-y-2">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                    Related Legal Policies
                  </span>
                  <div className="space-y-1 text-xs">
                    <Link
                      href="/copyright"
                      className="block py-1 text-neutral-600 dark:text-neutral-400 hover:text-[#7657ff]"
                    >
                      Copyright Notice →
                    </Link>
                    <Link
                      href="/proprietary-license"
                      className="block py-1 text-neutral-600 dark:text-neutral-400 hover:text-[#7657ff]"
                    >
                      Proprietary Software License →
                    </Link>
                    <Link
                      href="/unauthorized-usage"
                      className="block py-1 text-neutral-600 dark:text-neutral-400 hover:text-[#7657ff]"
                    >
                      Unauthorized Usage Policy →
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Document Body */}
            <article className="lg:col-span-8 space-y-10">
              {/* Section 1 */}
              <section id="overview" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h2 className="text-xl font-bold">Policy Overview & Ownership</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  This Intellectual Property Policy defines the rights, restrictions, and legal governance applicable to all software components, design systems, algorithms, trademarks, and documentation comprising the MedBridge Global platform. All original proprietary intellectual property is owned exclusively by <strong>Ashirwad Kumar</strong>.
                </p>
              </section>

              {/* Section 2 */}
              <section id="trademarks" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h2 className="text-xl font-bold">Trademarks & Brand Emblems</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  The names &quot;MedBridge&quot;, &quot;MedBridge Global&quot;, &quot;OmniCare Global&quot;, the distinctive medical cross intersected with the dynamic orbital arc emblem, and associated logos, trade dress, and brand motifs are proprietary trademarks and service marks of Ashirwad Kumar.
                </p>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <strong>Trademark Notice:</strong> You may not use, display, register, or reference MedBridge trademarks in any manner that creates consumer confusion, suggests endorsement, or damages brand reputation without prior written authorization.
                </div>
              </section>

              {/* Section 3 */}
              <section id="software-ip" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h2 className="text-xl font-bold">Proprietary Software & Architecture</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  MedBridge Global constitutes a proprietary monorepo architecture featuring full Next.js 16 web applications, React Native / Expo mobile applications, custom Express microservices, MongoDB database schemas, and AI medical triage processing workflows.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  All rights, algorithms, component hierarchies, and proprietary logic are protected under international copyright and trade secret laws.
                </p>
              </section>

              {/* Section 4 */}
              <section id="prohibited" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <h2 className="text-xl font-bold">Strictly Prohibited Activities</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Except as expressly authorized in writing by Ashirwad Kumar, the following actions are strictly forbidden:
                </p>
                <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span><strong>Cloning for Commercial Resale:</strong> Copying or re-hosting the repository to offer identical or derivative clinical software services.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span><strong>Code Plagiarism & Attribution Removal:</strong> Removing or altering copyright headers, licenses, or author attributions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span><strong>Decompilation & Reverse Engineering:</strong> Decompiling mobile binaries or obfuscated client packages.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span><strong>Scraping & Data Harvesting:</strong> Automated crawling of physician directory records or clinical content without authorization.</span>
                  </li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="dmca-process" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    05
                  </div>
                  <h2 className="text-xl font-bold">DMCA & Copyright Infringement Claims</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  We respect the intellectual property of others and enforce our own with diligence. If you believe any content on MedBridge Global infringes your copyright, or if you identify unauthorized distribution of our copyrighted software, please submit a formal DMCA notification containing:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <li>A physical or electronic signature of a person authorized to act on behalf of the owner.</li>
                  <li>Identification of the copyrighted work claimed to have been infringed.</li>
                  <li>Identification of the material claimed to be infringing and its exact URL or location.</li>
                  <li>Your address, telephone number, and email address.</li>
                  <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner.</li>
                  <li>A statement, under penalty of perjury, that the information in the notification is accurate and you are authorized to act.</li>
                </ol>
              </section>

              {/* Section 6 */}
              <section id="counter-notice" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    06
                  </div>
                  <h2 className="text-xl font-bold">Counter-Notification Procedure</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  If you believe that material you submitted was removed or disabled by mistake or misidentification, you may submit a formal counter-notification to our Designated Agent meeting the requirements of 17 U.S.C. § 512(g)(3).
                </p>
              </section>

              {/* Section 7 */}
              <section id="enforcement" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    07
                  </div>
                  <h2 className="text-xl font-bold">Legal Enforcement & Remedies</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Ashirwad Kumar actively monitors repository clones, traffic patterns, and code distributions. Any confirmed intellectual property infringement will result in:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 font-medium">
                    1. Immediate DMCA Takedown Notices to hosting providers and GitHub.
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 font-medium">
                    2. Formal Cease & Desist demands and termination of access.
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 font-medium">
                    3. Legal litigation for statutory damages, lost profits, and legal fees.
                  </div>
                </div>
              </section>

              {/* Section 8 */}
              <section id="contact" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    08
                  </div>
                  <h2 className="text-xl font-bold">Designated Agent Contact Information</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  All formal DMCA notifications, intellectual property inquiries, and licensing requests must be delivered directly to the designated copyright agent:
                </p>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/10 text-xs space-y-1.5">
                  <div className="font-semibold text-neutral-900 dark:text-white">Ashirwad Kumar</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Designated Copyright Agent & Project Owner</div>
                  <div className="text-neutral-600 dark:text-neutral-400">MedBridge Global Healthcare Platform</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Email: <a href="mailto:ashirwadkumar.dev@gmail.com" className="text-[#7657ff] font-semibold">ashirwadkumar.dev@gmail.com</a></div>
                </div>
              </section>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

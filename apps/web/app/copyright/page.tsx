import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ShieldCheck,
  Copyright,
  FileText,
  Lock,
  Globe,
  AlertTriangle,
  Mail,
  ChevronRight,
  Code2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Copyright Notice & Project Ownership | MedBridge Global",
  description:
    "Official Copyright Notice and Project Ownership statement establishing Ashirwad Kumar as the exclusive copyright holder of all original MedBridge Global source code, architecture, and proprietary assets.",
};

export default function CopyrightPage() {
  const sections = [
    { id: "ownership", label: "1. Ownership & Copyright Holder" },
    { id: "scope", label: "2. Scope of Protected Material" },
    { id: "all-rights-reserved", label: "3. All Rights Reserved Statement" },
    { id: "third-party", label: "4. Third-Party Open Source Software" },
    { id: "international", label: "5. International Copyright Treaties" },
    { id: "permissions", label: "6. Permission Requests & Licensing" },
    { id: "infringement", label: "7. Reporting Infringement" },
  ];

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#7657ff] dark:text-[#a99aff] text-[11px] font-bold tracking-[0.16em] uppercase mb-4">
              <Copyright className="w-3.5 h-3.5" />
              INTELLECTUAL PROPERTY & OWNERSHIP
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-4">
              Copyright Notice & Ownership
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Formal intellectual property notice establishing <strong>Ashirwad Kumar</strong> as the sole copyright holder and owner of all original source code, architectures, algorithms, branding, and assets comprising MedBridge Global.
            </p>
          </div>

          {/* Quick Highlight Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Copyright Holder
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                Ashirwad Kumar
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Copyright Year
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                2026 (All Rights Reserved)
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                License Type
              </span>
              <span className="text-sm sm:text-base font-bold text-[#7657ff] mt-1 block">
                Proprietary & Confidential
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Repository
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block truncate">
                @ashirwad682
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
                      href="/proprietary-license"
                      className="block py-1 text-neutral-600 dark:text-neutral-400 hover:text-[#7657ff]"
                    >
                      Proprietary Software License →
                    </Link>
                    <Link
                      href="/intellectual-property"
                      className="block py-1 text-neutral-600 dark:text-neutral-400 hover:text-[#7657ff]"
                    >
                      Intellectual Property Policy →
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
              <section id="ownership" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h2 className="text-xl font-bold">Ownership & Copyright Holder</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  The entire MedBridge Global software platform—encompassing the full monorepo architecture, web applications, mobile client applications, clinical REST API microservices, database schemas, workflow engines, user interfaces, documentation, visual identities, logos, and medical appointment scheduling logic—is the exclusive proprietary creation and intellectual property of <strong>Ashirwad Kumar</strong>.
                </p>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/10 font-mono text-xs text-neutral-800 dark:text-neutral-200">
                  Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
                </div>
              </section>

              {/* Section 2 */}
              <section id="scope" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h2 className="text-xl font-bold">Scope of Protected Material</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Copyright protection applies to every original element created for MedBridge Global, including but not limited to:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-[#7657ff] shrink-0 mt-0.5" />
                    <span><strong>Source Code:</strong> All TypeScript, React, Next.js, Node.js, and Expo implementations.</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-[#7657ff] shrink-0 mt-0.5" />
                    <span><strong>Database Schemas:</strong> Mongoose models, indexes, and validation routines.</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-[#7657ff] shrink-0 mt-0.5" />
                    <span><strong>UI/UX Design:</strong> Custom luxury tokens, layouts, card structures, and visual hierarchies.</span>
                  </li>
                  <li className="flex items-start gap-2 p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-[#7657ff] shrink-0 mt-0.5" />
                    <span><strong>Brand Assets:</strong> The MedBridge name, logo cross emblem, and iconography.</span>
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="all-rights-reserved" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h2 className="text-xl font-bold">All Rights Reserved Statement</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  No portion of this software, platform, codebase, or associated visual media may be copied, reproduced, duplicated, republished, downloaded, posted, broadcast, transmitted, sold, resold, sublicensed, or distributed in any manner or form, in whole or in part, without the express prior written consent of <strong>Ashirwad Kumar</strong>.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Unauthorized duplication, distribution, or decompilation of this software constitutes willful copyright infringement and will be pursued to the fullest extent permitted by domestic and international law.
                </p>
              </section>

              {/* Section 4 */}
              <section id="third-party" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <h2 className="text-xl font-bold">Third-Party Open Source Software</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  MedBridge Global integrates with and utilizes established third-party open-source libraries (such as React, Next.js, Expo, Tailwind CSS, Express, and Mongoose). 
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  <strong>Ashirwad Kumar does NOT claim ownership of any third-party open-source code.</strong> All third-party copyrights, licenses, and attributions are strictly acknowledged and preserved in full in <Link href="https://github.com/ashirwad682/MedBridge-Global/blob/main/THIRD_PARTY_LICENSES.md" target="_blank" className="text-[#7657ff] font-semibold underline underline-offset-4">THIRD_PARTY_LICENSES.md</Link>.
                </p>
              </section>

              {/* Section 5 */}
              <section id="international" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    05
                  </div>
                  <h2 className="text-xl font-bold">International Copyright Treaties</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  This work is protected internationally under the <strong>Berne Convention for the Protection of Literary and Artistic Works</strong>, the <strong>Universal Copyright Convention (UCC)</strong>, the <strong>WIPO Copyright Treaty (WCT)</strong>, and domestic copyright statutory legislation worldwide.
                </p>
              </section>

              {/* Section 6 */}
              <section id="permissions" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    06
                  </div>
                  <h2 className="text-xl font-bold">Permission Requests & Commercial Licensing</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Any intended commercial exploitation, enterprise licensing, deployment, white-label distribution, or modification of MedBridge Global requires prior written authorization executed by Ashirwad Kumar.
                </p>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/10 space-y-1 text-xs">
                  <div className="font-semibold text-neutral-900 dark:text-white">Direct Licensing Inquiries:</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Ashirwad Kumar (Project Owner)</div>
                  <div className="text-neutral-600 dark:text-neutral-400">Email: <a href="mailto:ashirwadkumar.dev@gmail.com" className="text-[#7657ff] font-medium">ashirwadkumar.dev@gmail.com</a></div>
                </div>
              </section>

              {/* Section 7 */}
              <section id="infringement" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    07
                  </div>
                  <h2 className="text-xl font-bold">Reporting Infringement</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  If you become aware of any unauthorized distribution, illegal reproduction, piracy, or commercial resale of MedBridge Global materials, please report it immediately with full evidence to <a href="mailto:ashirwadkumar.dev@gmail.com" className="text-[#7657ff] font-semibold underline underline-offset-4">ashirwadkumar.dev@gmail.com</a>.
                </p>
              </section>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

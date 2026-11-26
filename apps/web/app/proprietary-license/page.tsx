import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  FileText,
  Shield,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Code2,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Proprietary Software License | MedBridge Global",
  description:
    "Official Proprietary Software License Agreement for MedBridge Global. Outlining permitted evaluation usage, express restrictions, commercial rights, and copyright protections established by Ashirwad Kumar.",
};

export default function ProprietaryLicensePage() {
  const sections = [
    { id: "summary", label: "1. License Summary & Preamble" },
    { id: "ownership", label: "2. Proprietary Ownership" },
    { id: "prohibited", label: "3. Express Restrictions" },
    { id: "permitted", label: "4. Permitted Evaluation" },
    { id: "commercial", label: "5. Commercial Authorization" },
    { id: "third-party", label: "6. Third-Party Dependencies" },
    { id: "warranty", label: "7. Disclaimer of Warranties" },
    { id: "liability", label: "8. Limitation of Liability" },
    { id: "governing-law", label: "9. Governing Law & Jurisdiction" },
  ];

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#7657ff] dark:text-[#a99aff] text-[11px] font-bold tracking-[0.16em] uppercase mb-4">
              <FileText className="w-3.5 h-3.5" />
              SOFTWARE LICENSE AGREEMENT
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-4">
              Proprietary Software License
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Official legal terms governing the access, evaluation, and protection of the MedBridge Global source code, database architectures, and digital assets owned by <strong>Ashirwad Kumar</strong>.
            </p>
          </div>

          {/* Quick Highlight Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Licensor & Owner
              </span>
              <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 block">
                Ashirwad Kumar
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Commercial Sale
              </span>
              <span className="text-sm sm:text-base font-bold text-red-500 mt-1 block">
                Strictly Prohibited
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Redistribution
              </span>
              <span className="text-sm sm:text-base font-bold text-red-500 mt-1 block">
                Not Permitted
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Evaluation Access
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-500 mt-1 block">
                Personal / Academic Only
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
              {/* Permitted vs Prohibited Comparison Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Permitted Under License</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                    <li>• Personal, academic, and non-commercial evaluation.</li>
                    <li>• Local testing on a private development workstation.</li>
                    <li>• Inspecting architectures for portfolio / peer review.</li>
                    <li>• Contributing back under authorized contributor agreement.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-3xl bg-red-500/5 border border-red-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                    <XCircle className="w-4 h-4" />
                    <span>Strictly Prohibited</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                    <li>• Unauthorized copying, cloning, or public mirroring.</li>
                    <li>• Commercial exploitation, SaaS hosting, or resale.</li>
                    <li>• Creating derivative works, forks, or white-labeling.</li>
                    <li>• Sublicensing, distributing, or transferring rights.</li>
                  </ul>
                </div>
              </div>

              {/* Section 1 */}
              <section id="summary" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h2 className="text-xl font-bold">License Summary & Preamble</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  This Proprietary Software License Agreement (&quot;Agreement&quot;) is a legally binding contract between you (either an individual or a single legal entity) and <strong>Ashirwad Kumar</strong> (&quot;Licensor&quot; / &quot;Copyright Holder&quot;).
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  By accessing, viewing, downloading, cloning, compiling, or executing any portion of the MedBridge Global software, you agree to be bound by the terms of this Agreement. If you do not agree to all terms, you are not authorized to use or retain any part of the codebase.
                </p>
              </section>

              {/* Section 2 */}
              <section id="ownership" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h2 className="text-xl font-bold">Proprietary Ownership & Reservation of Rights</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  The software is licensed, not sold. Ashirwad Kumar retains all right, title, interest, ownership, copyright, trademarks, trade secrets, patents, and any other intellectual property rights in and to the Software worldwide.
                </p>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/10 font-mono text-xs text-neutral-800 dark:text-neutral-200">
                  Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
                </div>
              </section>

              {/* Section 3 */}
              <section id="prohibited" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h2 className="text-xl font-bold">Express Restrictions</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Except as expressly permitted by prior written authorization executed by Ashirwad Kumar, you shall not:
                </p>
                <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <li><strong>(a) Copying:</strong> Copy, mirror, duplicate, or transcribe the Software in whole or in part.</li>
                  <li><strong>(b) Redistribution:</strong> Distribute, republish, upload, or transmit the Software on public or private networks.</li>
                  <li><strong>(c) Derivatives:</strong> Modify, adapt, translate, enhance, or create derivative works or forks.</li>
                  <li><strong>(d) Commercialization:</strong> Sell, resell, rent, lease, license, or provide the Software as a SaaS or PaaS service.</li>
                  <li><strong>(e) Reverse Engineering:</strong> Decompile, disassemble, or extract trade secrets from compiled assets.</li>
                  <li><strong>(f) Branding:</strong> Use the &quot;MedBridge&quot; trademarks, logo cross emblem, or trade dress without permission.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="permitted" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <h2 className="text-xl font-bold">Permitted Evaluation Usage</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Ashirwad Kumar grants you a personal, revocable, non-exclusive, non-transferable license to inspect the source code locally on a single development workstation solely for internal evaluation, technical peer review, or educational assessment.
                </p>
              </section>

              {/* Section 5 */}
              <section id="commercial" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    05
                  </div>
                  <h2 className="text-xl font-bold">Commercial Authorization & Inquiries</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  To negotiate commercial licensing, white-label deployment, or enterprise partnerships, contact Ashirwad Kumar directly:
                </p>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/10 text-xs">
                  Email: <a href="mailto:ashirwadkumar.dev@gmail.com" className="text-[#7657ff] font-semibold">ashirwadkumar.dev@gmail.com</a>
                </div>
              </section>

              {/* Section 6 */}
              <section id="third-party" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    06
                  </div>
                  <h2 className="text-xl font-bold">Third-Party Open Source Dependencies</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Third-party dependencies (such as React, Next.js, Tailwind CSS, Express, and Mongoose) remain governed by their respective open-source licenses (MIT, Apache 2.0). Ashirwad Kumar does not claim ownership of third-party open-source code. Full attributions are preserved in <Link href="https://github.com/ashirwad682/MedBridge-Global/blob/main/THIRD_PARTY_LICENSES.md" target="_blank" className="text-[#7657ff] underline underline-offset-4">THIRD_PARTY_LICENSES.md</Link>.
                </p>
              </section>

              {/* Section 7 */}
              <section id="warranty" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    07
                  </div>
                  <h2 className="text-xl font-bold">Disclaimer of Warranties</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 uppercase tracking-wide font-mono text-[11px]">
                  THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </section>

              {/* Section 8 */}
              <section id="liability" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    08
                  </div>
                  <h2 className="text-xl font-bold">Limitation of Liability</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 uppercase tracking-wide font-mono text-[11px]">
                  IN NO EVENT SHALL ASHIRWAD KUMAR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THIS SOFTWARE.
                </p>
              </section>

              {/* Section 9 */}
              <section id="governing-law" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    09
                  </div>
                  <h2 className="text-xl font-bold">Governing Law & Jurisdiction</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  This Agreement is governed by applicable copyright statutes and international treaties (including the Berne Convention and WIPO). Infringements are subject to civil damages, statutory injunctions, and legal fees.
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

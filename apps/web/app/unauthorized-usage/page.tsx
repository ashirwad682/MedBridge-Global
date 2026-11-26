import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  FileX,
  XCircle,
  Scale,
  FileText,
  Mail,
  ChevronRight,
  ExternalLink,
  Ban,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Unauthorized Usage Policy | MedBridge Global",
  description:
    "Official Unauthorized Usage Policy detailing strict prohibitions against software piracy, unauthorized cloning, code reuse, brand infringement, and enforcement remedies established by Ashirwad Kumar.",
};

export default function UnauthorizedUsagePage() {
  const sections = [
    { id: "policy-intent", label: "1. Policy Intent & Overview" },
    { id: "prohibited-acts", label: "2. Specific Prohibited Activities" },
    { id: "clone-abuse", label: "3. Unauthorized Repository Cloning" },
    { id: "brand-impersonation", label: "4. Brand & Trademark Impersonation" },
    { id: "data-harvesting", label: "5. Scraping & Credential Harvesting" },
    { id: "technical-legal", label: "6. Legal & Technical Distinctions" },
    { id: "remedies", label: "7. Enforcement Remedies & Damages" },
    { id: "reporting", label: "8. Violation Reporting & Whistleblowing" },
  ];

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold tracking-[0.16em] uppercase mb-4">
              <Ban className="w-3.5 h-3.5" />
              STRICT ENFORCEMENT & COMPLIANCE
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-4">
              Unauthorized Usage Policy
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Strict legal standards and enforcement guidelines established by <strong>Ashirwad Kumar</strong> prohibiting unauthorized copying, reproduction, commercial reuse, or brand impersonation of MedBridge Global.
            </p>
          </div>

          {/* Quick Highlight Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Policy Stance
              </span>
              <span className="text-sm sm:text-base font-bold text-red-600 dark:text-red-400 mt-1 block">
                Zero Tolerance
              </span>
            </div>
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
                Legal Recourse
              </span>
              <span className="text-sm sm:text-base font-bold text-[#7657ff] mt-1 block">
                Statutory Injunctions
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400 block">
                Monitoring
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-500 mt-1 block">
                Active Traffic Auditing
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
                      href="/intellectual-property"
                      className="block py-1 text-neutral-600 dark:text-neutral-400 hover:text-[#7657ff]"
                    >
                      Intellectual Property Policy →
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Document Body */}
            <article className="lg:col-span-8 space-y-10">
              {/* Section 1 */}
              <section id="policy-intent" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h2 className="text-xl font-bold">Policy Intent & Overview</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  This Unauthorized Usage Policy exists to protect the proprietary integrity, copyright, trade secrets, and brand equity of MedBridge Global. <strong>Ashirwad Kumar</strong> maintains a strict zero-tolerance policy regarding software piracy, unlawful distribution, unauthorized commercial exploitation, and brand impersonation.
                </p>
              </section>

              {/* Section 2 */}
              <section id="prohibited-acts" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h2 className="text-xl font-bold">Specific Prohibited Activities</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  You are strictly prohibited from engaging in any of the following activities:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 space-y-1">
                    <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 text-red-500">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Plagiarism & Code Theft</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Copying, refactoring, or integrating original source code into other projects without attribution and prior written consent.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 space-y-1">
                    <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 text-red-500">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Commercial Exploitation</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Offering MedBridge Global or any derivative as a SaaS product, enterprise solution, paid download, or consulting deliverable.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 space-y-1">
                    <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 text-red-500">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Attribution Stripping</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Removing or modifying author copyright notices, file headers, LICENSE files, or contributor information.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 space-y-1">
                    <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 text-red-500">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Security Evasion</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Attempting to bypass authentication, session cookies, database validation, or repository branch protection rules.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="clone-abuse" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h2 className="text-xl font-bold">Unauthorized Repository Cloning & Mirroring</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Cloning the GitHub repository is strictly permitted only for personal, local evaluation under the <Link href="/proprietary-license" className="text-[#7657ff] underline underline-offset-4">Proprietary Software License</Link>. 
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Uploading cloned code to other public or private code repositories (e.g., GitHub, GitLab, Bitbucket), code-sharing websites, or file-sharing portals without written authorization is an explicit violation of our intellectual property rights.
                </p>
              </section>

              {/* Section 4 */}
              <section id="brand-impersonation" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <h2 className="text-xl font-bold">Brand & Trademark Impersonation</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  You may not use the MedBridge brand name, logo emblem (the cross-and-arc emblem), clinical badge designs, or marketing typography in any third-party app, website, or promotional campaign. Misleading consumers into believing an unauthorized fork is an official MedBridge service is strictly forbidden.
                </p>
              </section>

              {/* Section 5 */}
              <section id="data-harvesting" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                    05
                  </div>
                  <h2 className="text-xl font-bold">Scraping & Credential Harvesting</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Automated scraping, bot crawling, API abuse, or extraction of clinical data, physician profiles, consultation fee structures, or user records is strictly prohibited. Any attempt to harvest database credentials or probe undocumented endpoints will be logged and reported.
                </p>
              </section>

              {/* Section 6 */}
              <section id="technical-legal" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-[#7657ff] flex items-center justify-center font-bold text-xs">
                    06
                  </div>
                  <h2 className="text-xl font-bold">Legal & Technical Distinctions</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  We maintain a clear and transparent distinction between legal rights and technical capabilities:
                </p>
                <div className="space-y-3 text-xs text-neutral-700 dark:text-neutral-300">
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5">
                    <strong>1. Legal Protection vs Public Accessibility:</strong> A proprietary software license establishes legally binding obligations even if code is published in a public GitHub repository. Public visibility does NOT grant a license to copy or redistribute.
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5">
                    <strong>2. Clone Analytics vs Privacy:</strong> GitHub Traffic APIs provide aggregate traffic counts and unique visitor/cloner sessions. We respect privacy protections and do not fabricate or illicitly harvest personal identity data.
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section id="remedies" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                    07
                  </div>
                  <h2 className="text-xl font-bold">Enforcement Remedies & Damages</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  In the event of unauthorized usage, Ashirwad Kumar reserves all legal rights to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <li>Issue immediate DMCA takedown notices to web hosts, cloud providers, App Stores, and GitHub.</li>
                  <li>Demand immediate disgorgement of all profits realized from the unauthorized use.</li>
                  <li>Seek statutory copyright infringement damages and injunctive relief in competent courts.</li>
                  <li>Recover all reasonable attorney fees and legal expenses incurred during enforcement.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="reporting" className="scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-3 text-neutral-900 dark:text-white">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                    08
                  </div>
                  <h2 className="text-xl font-bold">Violation Reporting & Whistleblowing</h2>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  If you discover or suspect unauthorized duplication, piracy, or abuse of the MedBridge Global platform, please notify us immediately. Reports may be submitted confidentially:
                </p>
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/10 text-xs">
                  Email: <a href="mailto:ashirwadkumar.dev@gmail.com" className="text-[#7657ff] font-semibold">ashirwadkumar.dev@gmail.com</a>
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

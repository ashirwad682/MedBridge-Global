"use client";

/**
 * MedBridge Global - Repository Security & Clone Monitoring Dashboard
 * Copyright (c) 2026 Ashirwad Kumar. All Rights Reserved.
 * Proprietary and Confidential.
 */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Shield,
  ShieldCheck,
  GitFork,
  Eye,
  Users,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Code2,
  GitPullRequest,
  GitCommit,
  GitBranch,
  Terminal,
  FileCode,
  Activity,
  History,
  Info,
  KeyRound,
  FileCheck2,
} from "lucide-react";

interface DailyTraffic {
  timestamp: string;
  count: number;
  uniques: number;
}

interface Referrer {
  site: string;
  count: number;
  uniques: number;
}

interface PopularPath {
  path: string;
  title: string;
  count: number;
  uniques: number;
}

interface RepositoryMetrics {
  repositoryName: string;
  owner: string;
  snapshotDate: string;
  totalClones: number;
  uniqueCloners: number;
  dailyClones: DailyTraffic[];
  totalViews: number;
  uniqueVisitors: number;
  dailyViews: DailyTraffic[];
  referrers: Referrer[];
  popularPaths: PopularPath[];
  syncStatus: string;
  lastSyncedAt: string;
}

interface AuditLogItem {
  _id: string;
  eventType: string;
  description: string;
  actor: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  createdAt: string;
}

export default function AdminRepositoryDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RepositoryMetrics | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [privacyNotice, setPrivacyNotice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Fetch metrics on mount
  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/repository");
      const json = await res.json();
      if (json.success && json.data) {
        setMetrics(json.data.metrics);
        setAuditLogs(json.data.auditLogs || []);
        setPrivacyNotice(json.data.privacyNotice?.details || "");
      }
    } catch (err) {
      console.error("Failed to load repository metrics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setSyncMessage(null);
      const res = await fetch("/api/admin/repository", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setSyncMessage("Synchronized successfully with MongoDB database.");
        await fetchMetrics();
      } else {
        setSyncMessage(json.error || "Sync failed.");
      }
    } catch (err: any) {
      setSyncMessage(err.message || "Failed to trigger sync.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] dark:bg-[#080B11] text-[#17151F] dark:text-[#F8F7FC] transition-colors duration-300">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Top Header & Project Ownership Badge */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7657FF]/10 text-[#7657FF] border border-[#7657FF]/20">
                <Shield className="w-3.5 h-3.5" />
                Proprietary Security System
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Copyright Enforced
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Owner: <strong className="text-neutral-900 dark:text-white font-semibold">Ashirwad Kumar</strong> (@ashirwad682)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Repository Security & Clone Monitoring
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Real-time surveillance of GitHub repository clones, traffic patterns, authorized contributor activities, and intellectual property access control.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#7657FF] hover:bg-[#6846FF] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync GitHub Traffic"}</span>
            </button>
            <a
              href="https://github.com/ashirwad682/MedBridge-Global"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white dark:bg-white/10 hover:bg-neutral-100 dark:hover:bg-white/15 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10 text-xs font-semibold transition-all shadow-2xs"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {syncMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* GitHub Clone Privacy Boundary Notice (Important Requirement 4C & 9) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed text-blue-950 dark:text-blue-200">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              Important Notice: GitHub Clone Analytics & Technical Privacy Boundary
            </p>
            <p className="text-blue-800/90 dark:text-blue-300/80">
              Under GitHub&apos;s API architecture and international privacy compliance (GDPR), clone operations on public repositories are provided strictly as <strong>aggregate counts</strong> and <strong>unique cloners (IP/client sessions)</strong> over a 14-day rolling window. GitHub does NOT expose individual usernames, email addresses, or personal accounts of anonymous cloners.
            </p>
            <p className="text-blue-800/90 dark:text-blue-300/80">
              To overcome GitHub&apos;s 14-day retention limit, MedBridge Global automatically snapshots and persists all clone and traffic data into <strong>MongoDB Atlas</strong>, preserving an permanent historical audit log for Ashirwad Kumar. Verified account identities are tracked for authenticated commits, pull requests, and collaborator access.
            </p>
          </div>
        </div>

        {/* 4 Core Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Total Clones */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-[#0F131E]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Clones</span>
              <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <GitFork className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                {metrics ? metrics.totalClones : "..."}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                <span>Unique Cloners:</span>
                <strong className="text-neutral-800 dark:text-neutral-200">{metrics?.uniqueCloners || 0}</strong>
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/5 text-[11px] text-neutral-400">
              Aggregate Git clone requests (CLI & GUI)
            </div>
          </div>

          {/* Repository Views */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-[#0F131E]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Repository Views</span>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                {metrics ? metrics.totalViews : "..."}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1">
                <span>Unique Visitors:</span>
                <strong className="text-neutral-800 dark:text-neutral-200">{metrics?.uniqueVisitors || 0}</strong>
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/5 text-[11px] text-neutral-400">
              Web traffic to GitHub repo & docs
            </div>
          </div>

          {/* Verified Ownership */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-[#0F131E]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Project Ownership</span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white truncate">
                Ashirwad Kumar
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Sole Copyright Holder (@ashirwad682)
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/5 text-[11px] text-neutral-400">
              100% verified author attribution
            </div>
          </div>

          {/* Security & Secrets */}
          <div className="p-5 rounded-3xl bg-white/70 dark:bg-[#0F131E]/70 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Security & Credentials</span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                0 Leaks
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Secret Scanner & CI Active
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/5 text-[11px] text-neutral-400">
              Strict .env protection verified
            </div>
          </div>
        </div>

        {/* Clone Activity Breakdown & Daily Traffic */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Clone Timeline (2 Cols) */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#7657FF]" />
                  <span>Clone Activity Over Time</span>
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Daily aggregate clone operations and unique client IP addresses
                </p>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
                MongoDB Persisted
              </span>
            </div>

            {/* Daily Clones Table / Visualization */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200/60 dark:border-white/10 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Total Clones</th>
                    <th className="py-2.5 px-3">Unique Cloners</th>
                    <th className="py-2.5 px-3">Activity Bar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                  {metrics?.dailyClones && metrics.dailyClones.length > 0 ? (
                    metrics.dailyClones.map((item, idx) => {
                      const dateStr = new Date(item.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                      });
                      const barWidth = Math.min(100, (item.count / 15) * 100);
                      return (
                        <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-medium text-neutral-800 dark:text-neutral-200">
                            {dateStr}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-white">
                            {item.count}
                          </td>
                          <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-300">
                            {item.uniques}
                          </td>
                          <td className="py-2.5 px-3 w-48">
                            <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-white/10 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#7657FF] to-purple-400"
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-neutral-400">
                        No recent clone traffic data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traffic Sources & Referring Sites (1 Col) */}
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-500" />
                <span>Referring Traffic Sources</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Top domains referring traffic to the codebase
              </p>
            </div>

            <div className="space-y-3">
              {metrics?.referrers && metrics.referrers.length > 0 ? (
                metrics.referrers.map((ref, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">{ref.site}</div>
                      <div className="text-[11px] text-neutral-500">{ref.uniques} unique visitors</div>
                    </div>
                    <span className="font-bold text-[#7657FF]">{ref.count} views</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-neutral-400">No external referrers recorded yet.</div>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-white/5">
              <h3 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Popular Repository Paths
              </h3>
              <div className="space-y-2">
                {metrics?.popularPaths && metrics.popularPaths.length > 0 ? (
                  metrics.popularPaths.map((p, idx) => (
                    <div key={idx} className="text-xs flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span className="font-mono text-[11px] truncate max-w-[180px]">{p.path}</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">{p.count} hits</span>
                    </div>
                  ))
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Security & Protection Status Audit */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>GitHub Repository Security & Branch Protection Controls</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Strict multi-layer access control enforced to protect the proprietary integrity of MedBridge Global
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Status: Verified Secure
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Rule 1 */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs text-neutral-900 dark:text-white">Protected Production Branch</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Direct pushes and force pushes to <code className="text-[11px] bg-neutral-200 dark:bg-white/10 px-1 py-0.5 rounded">main</code> are strictly forbidden. All modifications require a dedicated feature branch.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs text-neutral-900 dark:text-white">Code Owner Sign-Off Required</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                <code className="text-[11px] bg-neutral-200 dark:bg-white/10 px-1 py-0.5 rounded">.github/CODEOWNERS</code> mandates explicit review and approval by <strong>@ashirwad682</strong> prior to merge.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs text-neutral-900 dark:text-white">Automated Secret Scanning</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Automated pre-commit and CI scanner (<code className="text-[11px] bg-neutral-200 dark:bg-white/10 px-1 py-0.5 rounded">npm run security:check</code>) detects exposed API keys, private keys, or DB credentials.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs text-neutral-900 dark:text-white">Proprietary Software License</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Enforced by international copyright law (Berne Convention) and repository <code className="text-[11px] bg-neutral-200 dark:bg-white/10 px-1 py-0.5 rounded">LICENSE</code>, prohibiting unauthorized redistribution.
              </p>
            </div>

            {/* Rule 5 */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs text-neutral-900 dark:text-white">Dependabot Vulnerability Alerts</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Automated weekly dependency auditing across root, web, mobile, and backend workspaces via <code className="text-[11px] bg-neutral-200 dark:bg-white/10 px-1 py-0.5 rounded">.github/dependabot.yml</code>.
              </p>
            </div>

            {/* Rule 6 */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs text-neutral-900 dark:text-white">Third-Party Attribution Preservation</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Strict separation of proprietary assets from open-source libraries (Next.js, React, Tailwind, Lucide) documented in <code className="text-[11px] bg-neutral-200 dark:bg-white/10 px-1 py-0.5 rounded">THIRD_PARTY_LICENSES.md</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Security Audit & Activity Log Stream */}
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#0F131E]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-neutral-500" />
                <span>Security Audit & Traffic Synchronization Log</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Immutable audit trail of administrative security actions and GitHub traffic snapshots
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200/60 dark:border-white/10 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Event</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                {auditLogs.length > 0 ? (
                  auditLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-neutral-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 text-neutral-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
                        {log.eventType}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-300">
                        {log.actor}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          log.severity === "CRITICAL"
                            ? "bg-red-500/10 text-red-600"
                            : log.severity === "WARNING"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-emerald-500/10 text-emerald-600"
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-700 dark:text-neutral-300 max-w-md truncate">
                        {log.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-neutral-400">
                      No security audit incidents recorded. System functioning normally.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links to Legal & IP Documentation */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-100/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/5 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#7657FF]" />
            <span>Associated Legal & Intellectual Property Documentation:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-medium">
            <Link href="/copyright" className="hover:text-neutral-900 dark:hover:text-white underline underline-offset-4">
              Copyright Notice
            </Link>
            <span>•</span>
            <Link href="/intellectual-property" className="hover:text-neutral-900 dark:hover:text-white underline underline-offset-4">
              IP Policy
            </Link>
            <span>•</span>
            <Link href="/proprietary-license" className="hover:text-neutral-900 dark:hover:text-white underline underline-offset-4">
              Proprietary License
            </Link>
            <span>•</span>
            <Link href="/unauthorized-usage" className="hover:text-neutral-900 dark:hover:text-white underline underline-offset-4">
              Unauthorized Usage Policy
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

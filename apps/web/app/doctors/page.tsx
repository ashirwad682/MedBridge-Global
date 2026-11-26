"use client";

import React, { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DoctorCard from "@/components/doctors/DoctorCard";
import { DOCTORS_DATA, SPECIALTIES_DATA, Doctor } from "@/lib/medical-data";
import { Search, Stethoscope, RefreshCw } from "lucide-react";

export default function DoctorsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(DOCTORS_DATA);
  const [specialtiesCountMap, setSpecialtiesCountMap] = useState<Record<string, number>>(() => {
    const initialMap: Record<string, number> = {};
    Object.values(SPECIALTIES_DATA).forEach((spec) => {
      initialMap[spec.id] = DOCTORS_DATA.filter((d) => d.specialtyId === spec.id).length;
    });
    return initialMap;
  });

  // Fetch live synchronized physician directory from MongoDB Atlas
  useEffect(() => {
    let isMounted = true;

    async function fetchDatabaseData() {
      try {
        const [docsRes, specsRes] = await Promise.all([
          fetch("/api/doctors?limit=100"),
          fetch("/api/specialties"),
        ]);

        if (docsRes.ok) {
          const docsData = await docsRes.json();
          if (isMounted && Array.isArray(docsData.doctors) && docsData.doctors.length > 0) {
            setDoctorsList(docsData.doctors);
          }
        }

        if (specsRes.ok) {
          const specsData = await specsRes.json();
          if (isMounted && Array.isArray(specsData.specialties)) {
            const countMap: Record<string, number> = {};
            specsData.specialties.forEach((s: any) => {
              countMap[s.specialtyId] = s.doctorCount;
            });
            setSpecialtiesCountMap((prev) => ({ ...prev, ...countMap }));
          }
        }
      } catch (err) {
        console.warn("Using baseline physician directory data during offline or cold start:", err);
      }
    }

    fetchDatabaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctorsList.filter((doctor) => {
      const matchesSpecialty =
        selectedSpecialty === "all" || doctor.specialtyId === selectedSpecialty;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doctor.name.toLowerCase().includes(q) ||
        (doctor.specialtyName && doctor.specialtyName.toLowerCase().includes(q)) ||
        (doctor.title && doctor.title.toLowerCase().includes(q)) ||
        (doctor.areasOfExpertise && doctor.areasOfExpertise.some((area) => area.toLowerCase().includes(q))) ||
        (doctor.bio && doctor.bio.toLowerCase().includes(q));

      return matchesSpecialty && matchesSearch;
    });
  }, [doctorsList, searchQuery, selectedSpecialty]);

  return (
    <main className="min-h-screen flex flex-col relative text-neutral-900 dark:text-white">
      <Navbar />

      {/* Directory Hero Header & Filter Controls (Streamlined spacing) */}
      <section id="doctors" className="pt-20 sm:pt-24 pb-2 relative overflow-hidden scroll-mt-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#7657ff] dark:text-[#a99aff] block mb-1.5">
              PHYSICIAN DIRECTORY
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight mb-2.5">
              Find a Specialist
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Connect with board-certified physicians, department directors, and clinical specialists across our synchronized healthcare ecosystem.
            </p>
          </div>

          {/* Search Bar & Specialty Filters with tight cohesive margins */}
          <div className="mt-5 space-y-3">
            {/* Search Input - Translucent Pill */}
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by physician name, specialty, condition, or keyword..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/70 dark:bg-white/[0.07] backdrop-blur-xl border border-white/80 dark:border-white/15 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#7657ff]/40 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-black dark:hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Specialty Glass Pills Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedSpecialty("all")}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSpecialty === "all"
                    ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-black shadow-xs"
                    : "bg-white/60 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border border-white/80 dark:border-white/12 hover:bg-white dark:hover:bg-white/20"
                }`}
              >
                All Specialties ({doctorsList.length})
              </button>
              {Object.values(SPECIALTIES_DATA).map((spec) => {
                const count = specialtiesCountMap[spec.id] ?? doctorsList.filter((d) => d.specialtyId === spec.id).length;
                const isSelected = selectedSpecialty === spec.id;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => setSelectedSpecialty(spec.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-black shadow-xs"
                        : "bg-white/60 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border border-white/80 dark:border-white/12 hover:bg-white dark:hover:bg-white/20"
                    }`}
                  >
                    {spec.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Cards Grid - Directly following the selector with zero dead space */}
      <section className="pt-2 pb-16 md:pb-24 relative flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Active Filter Metrics immediately below filter pills */}
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-200/60 dark:border-white/10 text-xs text-neutral-600 dark:text-neutral-400">
            <span>
              Showing <strong>{filteredDoctors.length}</strong> verified physician{filteredDoctors.length !== 1 ? "s" : ""}
            </span>
            {(searchQuery || selectedSpecialty !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("all");
                }}
                className="inline-flex items-center gap-1 text-[#7657ff] dark:text-[#a99aff] font-semibold hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center max-w-md mx-auto">
              <Stethoscope className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                No matching physicians found
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
                We couldn&rsquo;t find doctors matching &ldquo;{searchQuery}&rdquo;. Try clearing filters or searching another clinical term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSpecialty("all");
                }}
                className="px-5 py-2.5 rounded-full bg-[#0a0a0a] text-white dark:bg-white dark:text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                View All Specialists
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

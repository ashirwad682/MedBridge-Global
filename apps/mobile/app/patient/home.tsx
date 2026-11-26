import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/AuthContext";
import { BRAND_COLORS, SPECIALTIES_LIST } from "@medbridge/constants";
import { doctorApi, appointmentApi } from "@medbridge/api";
import { Doctor, AppointmentRecord } from "@medbridge/types";

export default function PatientHomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [nextAppointment, setNextAppointment] = useState<AppointmentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const docRes = await doctorApi.getAllDoctors();
        if (docRes.doctors) {
          setDoctors(docRes.doctors.slice(0, 5));
        }

        if (user?.email) {
          const aptRes = await appointmentApi.getAppointmentsByEmail(user.email);
          const upcoming = (aptRes.appointments || []).find((a) => a.status === "confirmed");
          if (upcoming) {
            setNextAppointment(upcoming);
          }
        }
      } catch (err) {
        console.log("Error loading patient home data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const firstName = user?.name ? user.name.split(" ")[0] : "Patient";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingSub}>MEDBRIDGE GLOBAL</Text>
            <Text style={styles.greetingName}>Hello, {firstName} 👋</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.avatar || "MB"}</Text>
          </View>
        </View>

        {/* Next Appointment Spotlight Card */}
        {nextAppointment ? (
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentTagRow}>
              <View style={styles.badgeConfirmed}>
                <Text style={styles.badgeText}>UPCOMING CONSULTATION</Text>
              </View>
              <Text style={styles.appointmentId}>{nextAppointment.id}</Text>
            </View>

            <Text style={styles.doctorName}>{nextAppointment.doctorName}</Text>
            <Text style={styles.specialtyName}>{nextAppointment.specialtyName}</Text>

            <View style={styles.dateSlotRow}>
              <View style={styles.dateSlotPill}>
                <Text style={styles.dateSlotText}>📅 {nextAppointment.date}</Text>
              </View>
              <View style={styles.dateSlotPill}>
                <Text style={styles.dateSlotText}>⏰ {nextAppointment.timeSlot}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewPassBtn}
              onPress={() => router.push("/patient/appointments")}
              activeOpacity={0.85}
            >
              <Text style={styles.viewPassBtnText}>View Clinical Pass →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.promoBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.promoTag}>ZERO WAIT-TIME CLINIC</Text>
              <Text style={styles.promoTitle}>Book Top Board-Certified Specialists</Text>
              <Text style={styles.promoSub}>Consultations in 8 premier disciplines.</Text>
            </View>
            <TouchableOpacity
              style={styles.promoBtn}
              onPress={() => router.push("/patient/doctors")}
            >
              <Text style={styles.promoBtnText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Specialties Horizontal Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medical Specialties</Text>
          <TouchableOpacity onPress={() => router.push("/patient/doctors")}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialtiesList}>
          {SPECIALTIES_LIST.map((spec) => (
            <TouchableOpacity
              key={spec.id}
              style={styles.specialtyChip}
              onPress={() => router.push({ pathname: "/patient/doctors", params: { specialty: spec.id } })}
              activeOpacity={0.8}
            >
              <View style={styles.specialtyIconBox}>
                <Text style={styles.specialtyIcon}>⚕</Text>
              </View>
              <Text style={styles.specialtyNameText} numberOfLines={1}>{spec.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Specialists */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Specialists</Text>
          <TouchableOpacity onPress={() => router.push("/patient/doctors")}>
            <Text style={styles.seeAllText}>Browse all ({doctors.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.doctorList}>
          {doctors.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={styles.doctorCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/doctor-detail/${doc.id}`)}
            >
              <View style={styles.doctorCardTop}>
                <View style={styles.doctorAvatarBox}>
                  <Text style={styles.doctorInitial}>{doc.name.charAt(4) || "Dr"}</Text>
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docSpecialty}>{doc.specialtyName}</Text>
                  <Text style={styles.docHospital} numberOfLines={1}>🏢 {doc.hospitalAffiliation}</Text>
                </View>
              </View>

              <View style={styles.doctorCardFooter}>
                <View style={styles.docRatingRow}>
                  <Text style={styles.starText}>★</Text>
                  <Text style={styles.ratingVal}>{doc.rating.toFixed(1)}</Text>
                  <Text style={styles.reviewsCount}>({doc.reviewsCount} reviews)</Text>
                </View>
                <Text style={styles.feeText}>{doc.consultationFee}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FC",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greetingSub: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: BRAND_COLORS.violet,
  },
  greetingName: {
    fontSize: 24,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.violet,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  appointmentCard: {
    backgroundColor: BRAND_COLORS.graphite,
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  appointmentTagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badgeConfirmed: {
    backgroundColor: "rgba(5, 150, 105, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(5, 150, 105, 0.4)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: "#34D399",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  appointmentId: {
    color: "#A0A0A5",
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  doctorName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  specialtyName: {
    fontSize: 13,
    color: BRAND_COLORS.lilac,
    marginBottom: 14,
  },
  dateSlotRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  dateSlotPill: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dateSlotText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "600",
  },
  viewPassBtn: {
    backgroundColor: BRAND_COLORS.violet,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  viewPassBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  promoBanner: {
    backgroundColor: BRAND_COLORS.ice,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(118, 87, 255, 0.2)",
  },
  promoTag: {
    fontSize: 10,
    fontWeight: "800",
    color: BRAND_COLORS.violet,
    letterSpacing: 1,
    marginBottom: 4,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
    marginBottom: 2,
  },
  promoSub: {
    fontSize: 12,
    color: "#666666",
  },
  promoBtn: {
    backgroundColor: BRAND_COLORS.violet,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  promoBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_COLORS.violet,
  },
  specialtiesList: {
    gap: 12,
    paddingBottom: 16,
  },
  specialtyChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    width: 105,
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  specialtyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.ice,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  specialtyIcon: {
    fontSize: 18,
    color: BRAND_COLORS.violet,
  },
  specialtyNameText: {
    fontSize: 11,
    fontWeight: "700",
    color: BRAND_COLORS.graphite,
    textAlign: "center",
  },
  doctorList: {
    gap: 12,
  },
  doctorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  doctorCardTop: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  doctorAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: BRAND_COLORS.ice,
    alignItems: "center",
    justifyContent: "center",
  },
  doctorInitial: {
    fontSize: 18,
    fontWeight: "800",
    color: BRAND_COLORS.violet,
  },
  doctorInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  docSpecialty: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_COLORS.violet,
    marginTop: 2,
  },
  docHospital: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 4,
  },
  doctorCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F4F4F5",
  },
  docRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starText: {
    color: "#F59E0B",
    fontSize: 13,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_COLORS.graphite,
  },
  reviewsCount: {
    fontSize: 11,
    color: "#8E8E93",
  },
  feeText: {
    fontSize: 13,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
});

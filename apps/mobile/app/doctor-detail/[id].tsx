import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/AuthContext";
import { BRAND_COLORS, STANDARD_TIME_SLOTS } from "@medbridge/constants";
import { doctorApi, appointmentApi } from "@medbridge/api";
import { Doctor, AppointmentRecord } from "@medbridge/types";

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  // Scheduling states
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowStr());
  const [selectedSlot, setSelectedSlot] = useState<string>("10:00 AM");
  const [reason, setReason] = useState("");
  const [patientPhone, setPatientPhone] = useState(user?.phone || "");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState<AppointmentRecord | null>(null);

  // Generate 7 upcoming date options
  const upcomingDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = d.getDate();
    return { dateStr, dayName, dayNum };
  });

  useEffect(() => {
    async function loadDoctor() {
      if (!id) return;
      try {
        const res = await doctorApi.getDoctorById(id);
        setDoctor(res.doctor);
      } catch (err) {
        console.error("Error loading doctor:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [id]);

  useEffect(() => {
    async function loadSlots() {
      if (!selectedDate || !id) return;
      try {
        const res = await appointmentApi.getSlots(selectedDate, id);
        setBookedSlots(res.bookedSlots || []);
      } catch (err) {
        console.error("Error loading slots:", err);
      }
    }
    loadSlots();
  }, [selectedDate, id]);

  const handleBooking = async () => {
    if (!doctor) return;
    if (!user) {
      Alert.alert("Sign In Required", "Please sign in to confirm this medical consultation.", [
        { text: "Sign In", onPress: () => router.push("/(auth)/login") },
        { text: "Cancel", style: "cancel" },
      ]);
      return;
    }

    setSubmitting(true);
    try {
      const res = await appointmentApi.bookAppointment({
        patientName: user.name,
        patientEmail: user.email,
        patientPhone: patientPhone || user.phone || "+1 (555) 000-0000",
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialtyId: doctor.specialtyId,
        specialtyName: doctor.specialtyName,
        hospitalAffiliation: doctor.hospitalAffiliation,
        date: selectedDate,
        timeSlot: selectedSlot,
        consultationReason: reason.trim() || "General Consultation",
        consultationFee: doctor.consultationFee,
      });

      if (res.success && res.appointment) {
        setConfirmedPass(res.appointment);
      } else {
        Alert.alert("Booking Failed", res.message || "Slot unavailable. Please pick another slot.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error during booking";
      Alert.alert("Booking Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={BRAND_COLORS.violet} />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Doctor profile not found.</Text>
      </View>
    );
  }

  // If confirmed pass is active, show the digital healthcare pass
  if (confirmedPass) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView contentContainerStyle={styles.passScroll}>
          <View style={styles.passCard}>
            <View style={styles.passHeader}>
              <View style={styles.checkBadge}>
                <Text style={styles.checkBadgeText}>✓</Text>
              </View>
              <Text style={styles.passTitle}>Consultation Confirmed</Text>
              <Text style={styles.passRef}>REF: {confirmedPass.id}</Text>
            </View>

            <View style={styles.passDivider} />

            <View style={styles.passDetails}>
              <View style={styles.passRow}>
                <Text style={styles.passLabel}>Patient:</Text>
                <Text style={styles.passVal}>{confirmedPass.patientName}</Text>
              </View>
              <View style={styles.passRow}>
                <Text style={styles.passLabel}>Specialist:</Text>
                <Text style={styles.passVal}>{confirmedPass.doctorName}</Text>
              </View>
              <View style={styles.passRow}>
                <Text style={styles.passLabel}>Specialty:</Text>
                <Text style={styles.passVal}>{confirmedPass.specialtyName}</Text>
              </View>
              <View style={styles.passRow}>
                <Text style={styles.passLabel}>Hospital:</Text>
                <Text style={styles.passVal}>{confirmedPass.hospitalAffiliation}</Text>
              </View>
              <View style={styles.passRow}>
                <Text style={styles.passLabel}>Date & Time:</Text>
                <Text style={styles.passHighlight}>{confirmedPass.date} • {confirmedPass.timeSlot}</Text>
              </View>
              <View style={styles.passRow}>
                <Text style={styles.passLabel}>Status:</Text>
                <Text style={styles.passStatusText}>CONFIRMED</Text>
              </View>
            </View>

            <View style={styles.passDivider} />

            <Text style={styles.passNote}>
              Please arrive 10 minutes prior or ensure high-speed connection for telehealth. Your clinical records will synchronize automatically.
            </Text>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => router.replace("/patient/appointments")}
            >
              <Text style={styles.doneBtnText}>View in My Appointments</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Doctor Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{doctor.name.charAt(4) || "Dr"}</Text>
          </View>
          <Text style={styles.docName}>{doctor.name}</Text>
          <Text style={styles.docSpecialty}>{doctor.specialtyName}</Text>
          <Text style={styles.docHospital}>🏢 {doctor.hospitalAffiliation}</Text>

          {/* Quick Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>★ {doctor.rating.toFixed(1)}</Text>
              <Text style={styles.metricLabel}>{doctor.reviewsCount} reviews</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{doctor.experienceYears}+ yrs</Text>
              <Text style={styles.metricLabel}>Experience</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>{doctor.consultationFee}</Text>
              <Text style={styles.metricLabel}>Visit Fee</Text>
            </View>
          </View>
        </View>

        {/* Bio & Clinical Expertise */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Clinical Overview</Text>
          <Text style={styles.bioText}>{doctor.bio}</Text>

          <Text style={[styles.cardHeading, { marginTop: 14 }]}>Qualifications</Text>
          <View style={styles.qualRow}>
            {doctor.qualifications.map((q, idx) => (
              <View key={idx} style={styles.qualChip}>
                <Text style={styles.qualText}>✓ {q}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Scheduling Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeading}>Select Appointment Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesScroll}>
            {upcomingDates.map((item) => {
              const isSelected = selectedDate === item.dateStr;
              return (
                <TouchableOpacity
                  key={item.dateStr}
                  style={[styles.dateChip, isSelected && styles.dateChipSelected]}
                  onPress={() => setSelectedDate(item.dateStr)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.dayName, isSelected && styles.dateTextSelected]}>{item.dayName}</Text>
                  <Text style={[styles.dayNum, isSelected && styles.dateTextSelected]}>{item.dayNum}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={[styles.cardHeading, { marginTop: 16 }]}>Select Available Slot</Text>
          <View style={styles.slotsGrid}>
            {STANDARD_TIME_SLOTS.map((slot) => {
              const isBooked = bookedSlots.includes(slot);
              const isSelected = selectedSlot === slot;

              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slotPill,
                    isSelected && styles.slotPillSelected,
                    isBooked && styles.slotPillBooked,
                  ]}
                  disabled={isBooked}
                  onPress={() => setSelectedSlot(slot)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.slotPillText,
                      isSelected && styles.slotTextSelected,
                      isBooked && styles.slotTextBooked,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Reason for Visit */}
          <Text style={[styles.cardHeading, { marginTop: 16 }]}>Chief Medical Reason (Optional)</Text>
          <TextInput
            style={styles.inputArea}
            placeholder="e.g. Annual cardiology checkup, blood pressure review..."
            placeholderTextColor="#8E8E93"
            value={reason}
            onChangeText={setReason}
            multiline
          />
        </View>

        {/* Confirm Action */}
        <TouchableOpacity
          style={[styles.confirmBtn, submitting && styles.confirmBtnDisabled]}
          onPress={handleBooking}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.confirmBtnText}>
              Confirm Consultation • {selectedDate} ({selectedSlot})
            </Text>
          )}
        </TouchableOpacity>
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
    gap: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: BRAND_COLORS.ice,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarLargeText: {
    fontSize: 26,
    fontWeight: "800",
    color: BRAND_COLORS.violet,
  },
  docName: {
    fontSize: 20,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  docSpecialty: {
    fontSize: 13,
    fontWeight: "700",
    color: BRAND_COLORS.violet,
    marginTop: 2,
  },
  docHospital: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#F8F7FC",
    borderRadius: 16,
    paddingVertical: 12,
    justifyContent: "space-around",
    alignItems: "center",
  },
  metricItem: {
    alignItems: "center",
  },
  metricVal: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  metricLabel: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#E7E7E7",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 13,
    color: "#52525B",
    lineHeight: 20,
  },
  qualRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  qualChip: {
    backgroundColor: "#F4F4F5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  qualText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#3F3F46",
  },
  datesScroll: {
    gap: 10,
    paddingBottom: 6,
  },
  dateChip: {
    width: 58,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
  },
  dateChipSelected: {
    backgroundColor: BRAND_COLORS.violet,
  },
  dayName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717A",
  },
  dayNum: {
    fontSize: 16,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
    marginTop: 2,
  },
  dateTextSelected: {
    color: "#FFFFFF",
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slotPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  slotPillSelected: {
    backgroundColor: BRAND_COLORS.violet,
    borderColor: BRAND_COLORS.violet,
  },
  slotPillBooked: {
    backgroundColor: "#F4F4F5",
    opacity: 0.4,
  },
  slotPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_COLORS.graphite,
  },
  slotTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  slotTextBooked: {
    color: "#A0A0A5",
    textDecorationLine: "line-through",
  },
  inputArea: {
    backgroundColor: "#F8F7FC",
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: BRAND_COLORS.graphite,
    minHeight: 60,
  },
  confirmBtn: {
    backgroundColor: BRAND_COLORS.violet,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 6,
    shadowColor: BRAND_COLORS.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#E11D48",
    fontSize: 15,
    fontWeight: "600",
  },
  // Pass modal styles
  passScroll: {
    padding: 24,
    justifyContent: "center",
  },
  passCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  passHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  checkBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  checkBadgeText: {
    fontSize: 28,
    color: "#059669",
    fontWeight: "800",
  },
  passTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  passRef: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_COLORS.violet,
    marginTop: 4,
  },
  passDivider: {
    height: 1,
    backgroundColor: "#E7E7E7",
    marginVertical: 16,
  },
  passDetails: {
    gap: 10,
  },
  passRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  passLabel: {
    fontSize: 13,
    color: "#71717A",
  },
  passVal: {
    fontSize: 13,
    fontWeight: "700",
    color: BRAND_COLORS.graphite,
  },
  passHighlight: {
    fontSize: 13,
    fontWeight: "800",
    color: BRAND_COLORS.violet,
  },
  passStatusText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#059669",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  passNote: {
    fontSize: 11,
    color: "#8E8E93",
    lineHeight: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  doneBtn: {
    backgroundColor: BRAND_COLORS.violet,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});


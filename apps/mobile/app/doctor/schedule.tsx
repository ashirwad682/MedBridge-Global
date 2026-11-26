import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BRAND_COLORS, STANDARD_TIME_SLOTS } from "@medbridge/constants";

export default function DoctorScheduleScreen() {
  const [activeDays, setActiveDays] = useState({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
    Sun: false,
  });

  const [acceptingNewPatients, setAcceptingNewPatients] = useState(true);
  const [telehealthEnabled, setTelehealthEnabled] = useState(true);

  const toggleDay = (day: keyof typeof activeDays) => {
    setActiveDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Practice Schedule</Text>
          <Text style={styles.headerSub}>Manage your availability, active consultation days, and slots.</Text>
        </View>

        {/* Practice Toggles */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Accepting New Patients</Text>
              <Text style={styles.toggleSub}>Show your profile in patient discovery listings</Text>
            </View>
            <Switch
              value={acceptingNewPatients}
              onValueChange={setAcceptingNewPatients}
              trackColor={{ false: "#D4D4D8", true: BRAND_COLORS.violet }}
            />
          </View>

          <View style={[styles.toggleRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Virtual Telehealth Slots</Text>
              <Text style={styles.toggleSub}>Enable remote video consultations alongside in-person</Text>
            </View>
            <Switch
              value={telehealthEnabled}
              onValueChange={setTelehealthEnabled}
              trackColor={{ false: "#D4D4D8", true: BRAND_COLORS.violet }}
            />
          </View>
        </View>

        {/* Working Days */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Clinical Days</Text>
        </View>

        <View style={styles.daysRow}>
          {(Object.keys(activeDays) as Array<keyof typeof activeDays>).map((day) => {
            const isActive = activeDays[day];
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayChip, isActive && styles.dayChipActive]}
                onPress={() => toggleDay(day)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayChipText, isActive && styles.dayChipTextActive]}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Standard Daily Slots */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Consultation Slots ({STANDARD_TIME_SLOTS.length})</Text>
        </View>

        <View style={styles.slotsGrid}>
          {STANDARD_TIME_SLOTS.map((slot) => (
            <View key={slot} style={styles.slotBox}>
              <Text style={styles.slotText}>⏰ {slot}</Text>
              <Text style={styles.slotStatus}>Active</Text>
            </View>
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
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  headerSub: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  toggleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    gap: 16,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
    paddingBottom: 16,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: BRAND_COLORS.graphite,
    marginBottom: 2,
  },
  toggleSub: {
    fontSize: 12,
    color: "#8E8E93",
  },
  sectionHeader: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  daysRow: {
    flexDirection: "row",
    gap: 8,
  },
  dayChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E7E7",
    alignItems: "center",
  },
  dayChipActive: {
    backgroundColor: BRAND_COLORS.violet,
    borderColor: BRAND_COLORS.violet,
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#71717A",
  },
  dayChipTextActive: {
    color: "#FFFFFF",
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  slotBox: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotText: {
    fontSize: 13,
    fontWeight: "600",
    color: BRAND_COLORS.graphite,
  },
  slotStatus: {
    fontSize: 10,
    fontWeight: "800",
    color: "#059669",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});


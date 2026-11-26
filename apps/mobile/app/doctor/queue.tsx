import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/AuthContext";
import { BRAND_COLORS } from "@medbridge/constants";

interface QueuePatient {
  id: string;
  name: string;
  ageGender: string;
  timeSlot: string;
  type: "In-Person" | "Virtual Video";
  chiefComplaint: string;
  status: "Checked In" | "In Consultation" | "Completed";
}

const INITIAL_QUEUE: QueuePatient[] = [
  {
    id: "PT-901",
    name: "Eleanor Vance",
    ageGender: "42 F",
    timeSlot: "10:00 AM",
    type: "In-Person",
    chiefComplaint: "Post-op cardiology evaluation & medication review",
    status: "Checked In",
  },
  {
    id: "PT-902",
    name: "Marcus Brody",
    ageGender: "58 M",
    timeSlot: "10:30 AM",
    type: "Virtual Video",
    chiefComplaint: "Chronic hypertension monitoring & lab discussion",
    status: "In Consultation",
  },
  {
    id: "PT-903",
    name: "Aria Thorne",
    ageGender: "29 F",
    timeSlot: "11:00 AM",
    type: "In-Person",
    chiefComplaint: "Routine executive wellness screening",
    status: "Checked In",
  },
];

export default function DoctorQueueScreen() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<QueuePatient[]>(INITIAL_QUEUE);

  const updateStatus = (id: string, newStatus: QueuePatient["status"]) => {
    setQueue((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.verifiedRow}>
              <Text style={styles.verifiedText}>CLINICAL WORKSPACE</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>✓ VERIFIED</Text>
              </View>
            </View>
            <Text style={styles.doctorName}>{user?.name || "Dr. Julian Thorne"}</Text>
            <Text style={styles.specSub}>{user?.specialization || "Internal Medicine Specialist"}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.avatar || "DR"}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{queue.length}</Text>
            <Text style={styles.statLabel}>Patients Today</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>
              {queue.filter((q) => q.status === "Checked In" || q.status === "In Consultation").length}
            </Text>
            <Text style={styles.statLabel}>In Queue</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{queue.filter((q) => q.status === "Completed").length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Queue List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Clinical Queue</Text>
          <Text style={styles.dateLabel}>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</Text>
        </View>

        <View style={styles.queueList}>
          {queue.map((item) => {
            const isCompleted = item.status === "Completed";
            const isInProgress = item.status === "In Consultation";

            return (
              <View key={item.id} style={[styles.queueCard, isCompleted && styles.queueCardCompleted]}>
                <View style={styles.cardTop}>
                  <View style={styles.timeSlotBadge}>
                    <Text style={styles.timeSlotText}>⏰ {item.timeSlot}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      isCompleted ? styles.statusCompleted : isInProgress ? styles.statusProgress : styles.statusWaiting,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isCompleted ? styles.textCompleted : isInProgress ? styles.textProgress : styles.textWaiting,
                      ]}
                    >
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.patientInfoRow}>
                  <Text style={styles.patientName}>{item.name}</Text>
                  <Text style={styles.patientAge}>{item.ageGender}</Text>
                </View>

                <Text style={styles.consultType}>Consultation Type: <Text style={{ fontWeight: "700" }}>{item.type}</Text></Text>
                <Text style={styles.complaintText}>Reason: {item.chiefComplaint}</Text>

                {/* Actions */}
                {!isCompleted ? (
                  <View style={styles.btnRow}>
                    {item.status === "Checked In" ? (
                      <TouchableOpacity
                        style={styles.startBtn}
                        onPress={() => updateStatus(item.id, "In Consultation")}
                      >
                        <Text style={styles.startBtnText}>Start Consult</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.completeBtn}
                        onPress={() => updateStatus(item.id, "Completed")}
                      >
                        <Text style={styles.completeBtnText}>Mark Completed ✓</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null}
              </View>
            );
          })}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    color: BRAND_COLORS.violet,
  },
  verifiedBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    color: "#059669",
    fontSize: 9,
    fontWeight: "800",
  },
  doctorName: {
    fontSize: 22,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  specSub: {
    fontSize: 12,
    color: "#71717A",
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BRAND_COLORS.graphite,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    alignItems: "center",
  },
  statNum: {
    fontSize: 20,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  statLabel: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  dateLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "600",
  },
  queueList: {
    gap: 14,
  },
  queueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    gap: 8,
  },
  queueCardCompleted: {
    opacity: 0.7,
    backgroundColor: "#FAFAFA",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeSlotBadge: {
    backgroundColor: BRAND_COLORS.ice,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeSlotText: {
    color: BRAND_COLORS.violet,
    fontSize: 12,
    fontWeight: "700",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusWaiting: {
    backgroundColor: "#FEF3C7",
  },
  statusProgress: {
    backgroundColor: "#DBEAFE",
  },
  statusCompleted: {
    backgroundColor: "#ECFDF5",
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  textWaiting: {
    color: "#D97706",
  },
  textProgress: {
    color: "#2563EB",
  },
  textCompleted: {
    color: "#059669",
  },
  patientInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  patientAge: {
    fontSize: 12,
    color: "#8E8E93",
  },
  consultType: {
    fontSize: 12,
    color: "#52525B",
  },
  complaintText: {
    fontSize: 12,
    color: "#71717A",
    lineHeight: 18,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  startBtn: {
    backgroundColor: BRAND_COLORS.violet,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  completeBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  completeBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});


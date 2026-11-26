import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/AuthContext";
import { BRAND_COLORS } from "@medbridge/constants";
import { appointmentApi } from "@medbridge/api";
import { AppointmentRecord } from "@medbridge/types";

export default function AppointmentsScreen() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    if (!user?.email) return;
    try {
      const res = await appointmentApi.getAppointmentsByEmail(user.email);
      setAppointments(res.appointments || []);
    } catch (err) {
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleCancel = (appointmentId: string) => {
    Alert.alert(
      "Cancel Consultation",
      `Are you sure you want to cancel appointment ${appointmentId}?`,
      [
        { text: "Keep Appointment", style: "cancel" },
        {
          text: "Cancel Appointment",
          style: "destructive",
          onPress: async () => {
            try {
              await appointmentApi.cancelAppointment(appointmentId);
              fetchAppointments();
            } catch (err) {
              Alert.alert("Cancellation Failed", "Unable to cancel appointment at this time.");
            }
          },
        },
      ]
    );
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filter === "upcoming") {
      return a.status === "confirmed" || a.status === "pending";
    }
    return a.status === "completed" || a.status === "cancelled";
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consultations</Text>
        <Text style={styles.headerSub}>Synchronized appointment records & clinical passes</Text>

        {/* Segmented Filter */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, filter === "upcoming" && styles.segmentBtnActive]}
            onPress={() => setFilter("upcoming")}
          >
            <Text style={[styles.segmentText, filter === "upcoming" && styles.segmentTextActive]}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, filter === "past" && styles.segmentBtnActive]}
            onPress={() => setFilter("past")}
          >
            <Text style={[styles.segmentText, filter === "past" && styles.segmentTextActive]}>Past & History</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={BRAND_COLORS.violet} />
        </View>
      ) : filteredAppointments.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>▦</Text>
          <Text style={styles.emptyTitle}>No {filter} appointments</Text>
          <Text style={styles.emptySub}>
            {filter === "upcoming"
              ? "You do not have any pending appointments scheduled."
              : "No historical consultations found for this account."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAppointments(); }} />}
          renderItem={({ item }) => {
            const isConfirmed = item.status === "confirmed";
            const isCancelled = item.status === "cancelled";

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.statusPill,
                      isConfirmed && styles.statusConfirmed,
                      isCancelled && styles.statusCancelled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        isConfirmed && styles.statusTextConfirmed,
                        isCancelled && styles.statusTextCancelled,
                      ]}
                    >
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.refId}>{item.id}</Text>
                </View>

                <Text style={styles.doctorName}>{item.doctorName}</Text>
                <Text style={styles.specialtyName}>{item.specialtyName}</Text>
                {item.hospitalAffiliation ? (
                  <Text style={styles.hospitalText}>🏢 {item.hospitalAffiliation}</Text>
                ) : null}

                <View style={styles.dateSlotBox}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Scheduled Date:</Text>
                    <Text style={styles.infoVal}>📅 {item.date}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Appointment Time:</Text>
                    <Text style={styles.infoVal}>⏰ {item.timeSlot}</Text>
                  </View>
                  {item.consultationReason ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Chief Reason:</Text>
                      <Text style={styles.infoVal}>{item.consultationReason}</Text>
                    </View>
                  ) : null}
                </View>

                {isConfirmed ? (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleCancel(item.id)}
                    >
                      <Text style={styles.cancelBtnText}>Cancel Booking</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E7E7E7",
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
    marginBottom: 14,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    borderRadius: 12,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#71717A",
  },
  segmentTextActive: {
    color: BRAND_COLORS.graphite,
    fontWeight: "700",
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#F4F4F5",
  },
  statusConfirmed: {
    backgroundColor: "#ECFDF5",
  },
  statusCancelled: {
    backgroundColor: "#FFF1F2",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#52525B",
  },
  statusTextConfirmed: {
    color: "#059669",
  },
  statusTextCancelled: {
    color: "#E11D48",
  },
  refId: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8E8E93",
  },
  doctorName: {
    fontSize: 17,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  specialtyName: {
    fontSize: 13,
    fontWeight: "600",
    color: BRAND_COLORS.violet,
    marginTop: 2,
  },
  hospitalText: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 4,
  },
  dateSlotBox: {
    backgroundColor: "#F8F7FC",
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#71717A",
  },
  infoVal: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_COLORS.graphite,
  },
  actionRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECDD3",
    backgroundColor: "#FFF1F2",
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E11D48",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyIcon: {
    fontSize: 40,
    color: "#A0A0A5",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: "#8E8E93",
    textAlign: "center",
  },
});


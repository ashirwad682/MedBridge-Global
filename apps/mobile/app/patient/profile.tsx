import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/AuthContext";
import { BRAND_COLORS } from "@medbridge/constants";

export default function PatientProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Confirm Sign Out", "Are you sure you want to end your current session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/welcome");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.avatar || "MB"}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || "Patient Account"}</Text>
          <Text style={styles.userRole}>PATIENT • {user?.isEmailVerified ? "VERIFIED ACCOUNT" : "ACTIVE"}</Text>

          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Email:</Text>
              <Text style={styles.metaVal}>{user?.email || "—"}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Phone:</Text>
              <Text style={styles.metaVal}>{user?.phone || "—"}</Text>
            </View>
          </View>
        </View>

        {/* Clinical Health Record Status */}
        <View style={styles.healthStatusCard}>
          <View style={styles.statusDot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.healthStatusTitle}>Health Records Synchronized</Text>
            <Text style={styles.healthStatusSub}>
              Consultation history, physician notes, and booking receipts are encrypted and backed up.
            </Text>
          </View>
        </View>

        {/* Options List */}
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/patient/appointments")}>
            <Text style={styles.menuItemText}>My Consultations & Passes</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/patient/doctors")}>
            <Text style={styles.menuItemText}>Find & Schedule Specialists</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert("Clinical Support", "Reach 24/7 MedBridge Patient Concierge at care@medbridge.com or +1 (800) 555-CARE.")}
          >
            <Text style={styles.menuItemText}>Help Center & Concierge</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>MedBridge Global v1.0.0 • Mobile Architecture</Text>
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
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: BRAND_COLORS.violet,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: BRAND_COLORS.graphite,
  },
  userRole: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    color: BRAND_COLORS.violet,
    marginTop: 4,
    marginBottom: 16,
  },
  metaBox: {
    width: "100%",
    backgroundColor: "#F8F7FC",
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaLabel: {
    fontSize: 12,
    color: "#71717A",
  },
  metaVal: {
    fontSize: 12,
    fontWeight: "600",
    color: BRAND_COLORS.graphite,
  },
  healthStatusCard: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#059669",
    marginTop: 4,
  },
  healthStatusTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 2,
  },
  healthStatusSub: {
    fontSize: 12,
    color: "#047857",
    lineHeight: 18,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F5",
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: BRAND_COLORS.graphite,
  },
  menuArrow: {
    fontSize: 18,
    color: "#A0A0A5",
  },
  logoutBtn: {
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FECDD3",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  logoutBtnText: {
    color: "#E11D48",
    fontSize: 14,
    fontWeight: "700",
  },
  versionText: {
    textAlign: "center",
    fontSize: 11,
    color: "#A0A0A5",
    marginTop: 10,
    marginBottom: 20,
  },
});


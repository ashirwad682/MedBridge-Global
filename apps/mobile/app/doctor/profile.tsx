import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/AuthContext";
import { BRAND_COLORS } from "@medbridge/constants";

export default function DoctorProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Physician Sign Out", "Are you sure you want to end your clinical workspace session?", [
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
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.avatar || "DR"}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || "Dr. Julian Thorne"}</Text>
          <Text style={styles.userRole}>
            {user?.specialization || "Internal Medicine Specialist"} • VERIFIED PHYSICIAN
          </Text>

          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Medical License ID:</Text>
              <Text style={styles.metaVal}>{user?.licenseNumber || "MED-NYC-9982"}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Hospital Affiliation:</Text>
              <Text style={styles.metaVal}>{user?.hospitalAffiliation || "Manhattan Medical Center"}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Institutional Email:</Text>
              <Text style={styles.metaVal}>{user?.email || "doctor@medbridge.com"}</Text>
            </View>
          </View>
        </View>

        {/* Verification Status */}
        <View style={styles.verifCard}>
          <Text style={styles.verifTitle}>✓ Board Credentialing Active</Text>
          <Text style={styles.verifBody}>
            Your credentials have been validated by MedBridge Global Clinical Review Board. You are authorized to issue digital prescription summaries and consultation passes.
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutBtnText}>Sign Out of Physician Portal</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>MedBridge Global • Doctor Clinical Suite v1.0.0</Text>
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
    backgroundColor: BRAND_COLORS.graphite,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 22,
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
    letterSpacing: 0.8,
    color: BRAND_COLORS.violet,
    marginTop: 4,
    marginBottom: 16,
    textAlign: "center",
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
    alignItems: "center",
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
  verifCard: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  verifTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#065F46",
  },
  verifBody: {
    fontSize: 12,
    color: "#047857",
    lineHeight: 18,
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
  },
});


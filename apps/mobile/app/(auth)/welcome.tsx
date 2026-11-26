import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BRAND_COLORS } from "@medbridge/constants";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>⚕</Text>
          </View>
          <Text style={styles.brandName}>MedBridge</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>PREMIUM HEALTHCARE</Text>
          </View>
          <Text style={styles.heroTitle}>World-Class Care,{"\n"}Directly in Hand.</Text>
          <Text style={styles.heroDescription}>
            Consult with top board-certified physicians across 8 medical specialties. Zero wait times, synchronized clinical records, and private consultations.
          </Text>
        </View>

        {/* Value Points */}
        <View style={styles.featuresCard}>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>✦</Text>
            <View style={styles.featureTextWrapper}>
              <Text style={styles.featureHeading}>Verified Specialists</Text>
              <Text style={styles.featureSub}>Leading physicians with verified credentials and hospital affiliations.</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>✦</Text>
            <View style={styles.featureTextWrapper}>
              <Text style={styles.featureHeading}>Instant Slot Booking</Text>
              <Text style={styles.featureSub}>Real-time scheduling with automatic digital consultation passes.</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>✦</Text>
            <View style={styles.featureTextWrapper}>
              <Text style={styles.featureHeading}>Synchronized Records</Text>
              <Text style={styles.featureSub}>Unified private medical health vault across all devices.</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionGroup}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.primaryBtnText}>Sign In to Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/register-patient")}
          >
            <Text style={styles.secondaryBtnText}>Create Patient Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textBtn}
            activeOpacity={0.7}
            onPress={() => router.push("/register-doctor")}
          >
            <Text style={styles.textBtnText}>Are you a physician? <Text style={styles.textBtnHighlight}>Join Practice</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.graphite,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BRAND_COLORS.violet,
    alignItems: "center",
    justifyContent: "center",
  },
  brandBadgeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  brandName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  heroSection: {
    marginBottom: 24,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(118, 87, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(169, 154, 255, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 16,
  },
  tagText: {
    color: BRAND_COLORS.lilac,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 38,
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    color: "#A0A0A5",
    lineHeight: 22,
  },
  featuresCard: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 32,
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    gap: 12,
  },
  featureBullet: {
    color: BRAND_COLORS.violet,
    fontSize: 14,
    marginTop: 1,
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  featureSub: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
  },
  actionGroup: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: BRAND_COLORS.violet,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: BRAND_COLORS.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  secondaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  textBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  textBtnText: {
    color: "#8E8E93",
    fontSize: 13,
  },
  textBtnHighlight: {
    color: BRAND_COLORS.lilac,
    fontWeight: "700",
  },
});


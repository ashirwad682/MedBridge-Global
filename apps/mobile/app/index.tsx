import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../components/AuthContext";
import { BRAND_COLORS } from "@medbridge/constants";

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          if (user.role === "doctor") {
            router.replace("/doctor/queue");
          } else {
            router.replace("/patient/home");
          }
        } else {
          router.replace("/welcome");
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <Text style={styles.logoIcon}>⚕</Text>
      </View>
      <Text style={styles.title}>MEDBRIDGE</Text>
      <Text style={styles.subtitle}>GLOBAL HEALTHCARE NETWORK</Text>
      <ActivityIndicator size="small" color={BRAND_COLORS.violet} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.graphite,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: BRAND_COLORS.violet,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: BRAND_COLORS.violet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 34,
    color: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: BRAND_COLORS.lilac,
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});


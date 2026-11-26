import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/AuthContext";
import { BRAND_COLORS } from "@medbridge/constants";

export default function LoginScreen() {
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    const res = await login(email.trim().toLowerCase(), password, role);
    setLoading(false);

    if (res.success) {
      if (role === "doctor") {
        router.replace("/doctor/queue");
      } else {
        router.replace("/patient/home");
      }
    } else {
      setErrorMsg(res.error || "Authentication failed. Check your credentials.");
    }
  };

  const fillDemo = (demoRole: "patient" | "doctor") => {
    setRole(demoRole);
    if (demoRole === "patient") {
      setEmail("patient@medbridge.com");
      setPassword("password123");
    } else {
      setEmail("doctor@medbridge.com");
      setPassword("password123");
    }
    setErrorMsg("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Access your medical records and appointments.</Text>
          </View>

          {/* Role Switcher */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleTab, role === "patient" && styles.roleTabActive]}
              onPress={() => setRole("patient")}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleTabText, role === "patient" && styles.roleTabTextActive]}>Patient</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleTab, role === "doctor" && styles.roleTabActive]}
              onPress={() => setRole("doctor")}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleTabText, role === "doctor" && styles.roleTabTextActive]}>Physician</Text>
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {errorMsg}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#71717A"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passLabelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#71717A"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Demo Fill Buttons */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Quick Demo Logins</Text>
            <View style={styles.demoRow}>
              <TouchableOpacity style={styles.demoChip} onPress={() => fillDemo("patient")}>
                <Text style={styles.demoChipText}>Demo Patient</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.demoChip} onPress={() => fillDemo("doctor")}>
                <Text style={styles.demoChipText}>Demo Doctor</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Switch to Register */}
          <View style={styles.switchAuth}>
            <Text style={styles.switchAuthText}>Don't have an account yet? </Text>
            <TouchableOpacity onPress={() => router.push(role === "doctor" ? "/register-doctor" : "/register-patient")}>
              <Text style={styles.switchAuthLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 20,
    paddingVertical: 6,
  },
  backBtnText: {
    color: BRAND_COLORS.lilac,
    fontSize: 14,
    fontWeight: "600",
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#A0A0A5",
  },
  roleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 9,
  },
  roleTabActive: {
    backgroundColor: BRAND_COLORS.violet,
  },
  roleTabText: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "600",
  },
  roleTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  errorBox: {
    backgroundColor: "rgba(225, 29, 72, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(225, 29, 72, 0.3)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: "#FDA4AF",
    fontSize: 13,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    color: "#D4D4D8",
    fontSize: 13,
    fontWeight: "600",
  },
  passLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotText: {
    color: BRAND_COLORS.lilac,
    fontSize: 12,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#FFFFFF",
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: BRAND_COLORS.violet,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  demoSection: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
  },
  demoTitle: {
    color: "#71717A",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  demoRow: {
    flexDirection: "row",
    gap: 10,
  },
  demoChip: {
    backgroundColor: "rgba(118, 87, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(169, 154, 255, 0.25)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  demoChipText: {
    color: BRAND_COLORS.lilac,
    fontSize: 12,
    fontWeight: "600",
  },
  switchAuth: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  switchAuthText: {
    color: "#8E8E93",
    fontSize: 13,
  },
  switchAuthLink: {
    color: BRAND_COLORS.lilac,
    fontSize: 13,
    fontWeight: "700",
  },
});


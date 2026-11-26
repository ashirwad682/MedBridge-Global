import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { BRAND_COLORS } from "@medbridge/constants";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Password Recovery</Text>
      <Text style={styles.subtitle}>Enter your account email to receive security verification instructions.</Text>

      {submitted ? (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>✓ Recovery Link Sent</Text>
          <Text style={styles.successBody}>
            If an account exists for {email}, a recovery link has been dispatched. Please review your inbox.
          </Text>
          <TouchableOpacity style={styles.returnBtn} onPress={() => router.replace("/login")}>
            <Text style={styles.returnBtnText}>Return to Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Email</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#71717A"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleReset}>
            <Text style={styles.submitBtnText}>Send Reset Link</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.graphite,
    padding: 24,
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
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#A0A0A5",
    marginBottom: 24,
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
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  successCard: {
    backgroundColor: "rgba(5, 150, 105, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(5, 150, 105, 0.3)",
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  successTitle: {
    color: "#6EE7B7",
    fontSize: 16,
    fontWeight: "700",
  },
  successBody: {
    color: "#E2E8F0",
    fontSize: 13,
    lineHeight: 20,
  },
  returnBtn: {
    backgroundColor: BRAND_COLORS.violet,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  returnBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});


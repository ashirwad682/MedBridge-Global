import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/AuthContext";
import { BRAND_COLORS } from "@medbridge/constants";

export default function RegisterDoctorScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [hospitalAffiliation, setHospitalAffiliation] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { registerDoctor } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !phone || !specialization || !licenseNumber || !password) {
      setErrorMsg("Please fill in all required physician credential fields.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    const res = await registerDoctor({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      specialization: specialization.trim(),
      licenseNumber: licenseNumber.trim(),
      hospitalAffiliation: hospitalAffiliation.trim(),
      password,
    });
    setLoading(false);

    if (res.success) {
      router.replace("/doctor/queue");
    } else {
      setErrorMsg(res.error || "Doctor registration failed.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.titleSection}>
            <Text style={styles.tag}>PHYSICIAN CREDENTIALING</Text>
            <Text style={styles.title}>Join Clinical Network</Text>
            <Text style={styles.subtitle}>Partner with MedBridge Global to manage digital patient queues.</Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Legal & Clinical Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Dr. Vivek Saxena, MD"
                placeholderTextColor="#71717A"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Institutional / Professional Email</Text>
              <TextInput
                style={styles.input}
                placeholder="doctor@hospital.org"
                placeholderTextColor="#71717A"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 987-6543"
                placeholderTextColor="#71717A"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medical Specialization</Text>
              <TextInput
                style={styles.input}
                placeholder="Cardiology / Internal Medicine"
                placeholderTextColor="#71717A"
                value={specialization}
                onChangeText={setSpecialization}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medical Registration / License No.</Text>
              <TextInput
                style={styles.input}
                placeholder="LIC-NY-884920"
                placeholderTextColor="#71717A"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Primary Hospital / Clinic Affiliation</Text>
              <TextInput
                style={styles.input}
                placeholder="Johns Hopkins / Manhattan Medical"
                placeholderTextColor="#71717A"
                value={hospitalAffiliation}
                onChangeText={setHospitalAffiliation}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password (min 6 chars)</Text>
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
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Physician Application</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.switchAuth}>
            <Text style={styles.switchAuthText}>Already registered as a doctor? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.switchAuthLink}>Sign in</Text>
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
    marginBottom: 16,
    paddingVertical: 6,
  },
  backBtnText: {
    color: BRAND_COLORS.lilac,
    fontSize: 14,
    fontWeight: "600",
  },
  titleSection: {
    marginBottom: 20,
  },
  tag: {
    color: BRAND_COLORS.lilac,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#A0A0A5",
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
    gap: 14,
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
    paddingVertical: 13,
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
  switchAuth: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
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


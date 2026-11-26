import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../components/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" backgroundColor="#17151F" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
          <Stack.Screen name="patient" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="doctor" options={{ animation: "slide_from_right" }} />
          <Stack.Screen
            name="doctor-detail/[id]"
            options={{
              headerShown: true,
              headerTitle: "Doctor Profile",
              headerTintColor: "#17151F",
              headerStyle: { backgroundColor: "#FFFFFF" },
              headerBackTitle: "Back",
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

import React from "react";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register-patient" />
      <Stack.Screen name="register-doctor" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}


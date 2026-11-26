"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/lib/auth";

export type AuthModalMode = "select-role" | "login" | "register";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  authRole: UserRole;
  openAuthModal: (mode?: AuthModalMode, role?: UserRole) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: AuthModalMode) => void;
  setAuthRole: (role: UserRole) => void;
  login: (data: { email: string; password: string; role?: UserRole }) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    specialization?: string;
    licenseNumber?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>("select-role");
  const [authRole, setAuthRole] = useState<UserRole>("patient");

  // Load session from server on mount
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Session verification error:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const openAuthModal = (mode: AuthModalMode = "select-role", role: UserRole = "patient") => {
    setAuthModalMode(mode);
    setAuthRole(role);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (credentials: { email: string; password: string; role?: UserRole }): Promise<User> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to log in.");
    }

    setUser(data.user);
    closeAuthModal();

    const targetDashboard =
      data.redirectTo ||
      (data.user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient");
    router.push(targetDashboard);

    return data.user;
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    specialization?: string;
    licenseNumber?: string;
  }): Promise<User> => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok) {
      throw new Error(resData.error || "Failed to register account.");
    }

    setUser(resData.user);
    closeAuthModal();

    const targetDashboard =
      resData.redirectTo ||
      (resData.user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient");
    router.push(targetDashboard);

    return resData.user;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        authRole,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        setAuthRole,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


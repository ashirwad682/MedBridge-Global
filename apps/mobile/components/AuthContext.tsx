import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthenticatedUser } from "@medbridge/types";
import { authApi, setAuthToken, setBaseUrl } from "@medbridge/api";
import Constants from "expo-constants";

// Auto-detect backend host if running in Expo on a real device or simulator
try {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      setBaseUrl(`http://${host}:5001`);
    }
  }
} catch {
  // Use default
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  registerPatient: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  registerDoctor: (data: {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    licenseNumber: string;
    hospitalAffiliation?: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setUser: (user: AuthenticatedUser | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => ({ success: false }),
  registerPatient: async () => ({ success: false }),
  registerDoctor: async () => ({ success: false }),
  logout: async () => {},
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial auth state with a 1.5s timeout safeguard
    let isMounted = true;
    const timeout = new Promise((resolve) => setTimeout(resolve, 1500));

    async function checkAuth() {
      try {
        const res = (await Promise.race([authApi.getMe(), timeout])) as any;
        if (isMounted && res && res.success && res.user) {
          setUser(res.user);
        }
      } catch {
        // Not logged in or backend offline
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, pass: string, role?: string) => {
    try {
      const res = await authApi.login({ email, password: pass, role });
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) {
          setTokenState(res.token);
          setAuthToken(res.token);
        }
        return { success: true };
      }
      return { success: false, error: res.error || "Login failed" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, error: msg };
    }
  };

  const registerPatient = async (data: { name: string; email: string; phone: string; password: string }) => {
    try {
      const res = await authApi.registerPatient(data);
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) {
          setTokenState(res.token);
          setAuthToken(res.token);
        }
        return { success: true };
      }
      return { success: false, error: res.error || "Registration failed" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, error: msg };
    }
  };

  const registerDoctor = async (data: {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    licenseNumber: string;
    hospitalAffiliation?: string;
    password: string;
  }) => {
    try {
      const res = await authApi.registerDoctor(data);
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) {
          setTokenState(res.token);
          setAuthToken(res.token);
        }
        return { success: true };
      }
      return { success: false, error: res.error || "Registration failed" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setTokenState(null);
      setAuthToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        registerPatient,
        registerDoctor,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


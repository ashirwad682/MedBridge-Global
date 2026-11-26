import {
  AuthenticatedUser,
  AuthResponse,
  Doctor,
  AppointmentRecord,
  CreateAppointmentInput,
  SpecialtyData,
} from "@medbridge/types";
import { API_ENDPOINTS } from "@medbridge/constants";
import { getApiBaseUrl } from "@medbridge/config";

let authToken: string | null = null;
let dynamicBaseUrl: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

export function setBaseUrl(url: string): void {
  dynamicBaseUrl = url;
}

export function getBaseUrl(): string {
  if (dynamicBaseUrl) return dynamicBaseUrl;
  return getApiBaseUrl();
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const base = getBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: options.credentials || "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const authApi = {
  login: async (credentials: { email: string; password: string; role?: string }): Promise<AuthResponse> => {
    const res = await request<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  registerPatient: async (data: { name: string; email: string; phone: string; password: string }): Promise<AuthResponse> => {
    const res = await request<AuthResponse>(API_ENDPOINTS.REGISTER_PATIENT, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  registerDoctor: async (data: {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    licenseNumber: string;
    hospitalAffiliation?: string;
    password: string;
  }): Promise<AuthResponse> => {
    const res = await request<AuthResponse>(API_ENDPOINTS.REGISTER_DOCTOR, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },

  getMe: async (): Promise<{ success: boolean; user: AuthenticatedUser | null }> => {
    return request<{ success: boolean; user: AuthenticatedUser | null }>(API_ENDPOINTS.ME);
  },

  logout: async (): Promise<{ success: boolean }> => {
    try {
      const res = await request<{ success: boolean }>(API_ENDPOINTS.LOGOUT, { method: "POST" });
      setAuthToken(null);
      return res;
    } catch {
      setAuthToken(null);
      return { success: true };
    }
  },
};

export const doctorApi = {
  getAllDoctors: async (params?: { specialty?: string; search?: string }): Promise<{ doctors: Doctor[] }> => {
    const query = new URLSearchParams();
    if (params?.specialty) query.set("specialty", params.specialty);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return request<{ doctors: Doctor[] }>(`${API_ENDPOINTS.DOCTORS}${qs}`);
  },

  getDoctorById: async (id: string): Promise<{ doctor: Doctor | null }> => {
    return request<{ doctor: Doctor | null }>(`${API_ENDPOINTS.DOCTORS}/${id}`);
  },
};

export const appointmentApi = {
  getSlots: async (date: string, doctorId?: string): Promise<{ bookedSlots: string[] }> => {
    const query = new URLSearchParams({ date });
    if (doctorId) query.set("doctorId", doctorId);
    return request<{ bookedSlots: string[] }>(`${API_ENDPOINTS.APPOINTMENTS}?${query.toString()}`);
  },

  getAppointmentsByEmail: async (email: string): Promise<{ appointments: AppointmentRecord[] }> => {
    const query = new URLSearchParams({ email });
    return request<{ appointments: AppointmentRecord[] }>(`${API_ENDPOINTS.APPOINTMENTS}?${query.toString()}`);
  },

  bookAppointment: async (input: CreateAppointmentInput): Promise<{ success: boolean; appointment: AppointmentRecord; message?: string }> => {
    return request<{ success: boolean; appointment: AppointmentRecord; message?: string }>(API_ENDPOINTS.APPOINTMENTS, {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  cancelAppointment: async (id: string, reason?: string): Promise<{ success: boolean; message?: string }> => {
    return request<{ success: boolean; message?: string }>(`${API_ENDPOINTS.APPOINTMENTS}`, {
      method: "PATCH",
      body: JSON.stringify({ id, action: "cancel", reason }),
    });
  },
};


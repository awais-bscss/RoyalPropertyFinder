import apiClient from "@/lib/axios";

// TypeScript interfaces for requests and responses
export interface LoginResponse {
  success: boolean;
  message: string;
  data: any;
}

export const AuthService = {
  // A standard Email/Password Login Endpoint
  login: async (credentials: { email: string; password: string; rememberMe?: boolean }): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials);
    return response as any; 
  },

  // A standard Registration Endpoint
  register: async (data: any): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/register", data);
    return response as any;
  },

  // Fetch the current authenticated user dynamically
  getMe: async (): Promise<any> => {
    const response = await apiClient.get("/auth/me");
    return response;
  },

  // A generic logout ping to wipe cookies securely on Node level
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
  // Request a password reset link to be logged in console (mocked)
  forgotPassword: async (email: string): Promise<any> => {
    return await apiClient.post("/auth/forgot-password", { email });
  },

  // Update password with a valid token from URL
  resetPassword: async (token: string, data: any): Promise<any> => {
    return await apiClient.patch(`/auth/reset-password/${token}`, data);
  },

  // Update password for an authenticated user
  updatePassword: async (data: any): Promise<any> => {
    return await apiClient.patch("/auth/update-password", data);
  },

  // Update user profile information and profile picture
  updateProfile: async (formData: FormData): Promise<any> => {
    return await apiClient.patch("/users/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Resend the email verification link
  resendVerification: async (): Promise<any> => {
    return await apiClient.post("/auth/resend-verification");
  },

  // === SESSION MANAGEMENT (REDIS) ===
  getSessions: async (): Promise<any> => {
    return await apiClient.get("/auth/sessions");
  },

  revokeSession: async (sessionId: string): Promise<any> => {
    return await apiClient.delete(`/auth/sessions/${sessionId}`);
  },

  revokeAllSessions: async (): Promise<any> => {
    return await apiClient.delete("/auth/sessions");
  },

  deleteSessionHistory: async (sessionId: string): Promise<any> => {
    return await apiClient.delete(`/auth/sessions/history/${sessionId}`);
  },

  clearHistory: async (): Promise<any> => {
    return await apiClient.delete("/auth/sessions/history");
  },

  deactivateAccount: async (): Promise<any> => {
    const response = await apiClient.post("/auth/deactivate");
    return response.data;
  },

  deleteAccount: async (): Promise<any> => {
    const response = await apiClient.delete("/auth/delete-account");
    return response.data;
  }
};

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
  }
};

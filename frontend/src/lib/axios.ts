import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

// Create a centralized Axios instance
const apiClient: AxiosInstance = axios.create({
  // Use environment variable for base URL, fallback to localhost in development
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  // Crucial for OAuth / Http-Only Cookies to be sent faithfully with requests
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 seconds timeout for requests
});

// ------------------------------------------------------------------
// Request Interceptor
// ------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If you later decide to store JWT in memory or localStorage instead of cookies (e.g. zustand context), 
    // you can attach the Authorization header dynamically here:
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------     
// Response Interceptor
// -----------------------------------------------------------------
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Unwrap the top-level response payload for cleaner controller components
    // If response is empty (e.g., 204 No Content), return a truthy object so UI updates trigger
    return response.data || { success: true };
  },
  async (error: AxiosError) => {
    // Destructure the response from error safely
    const originalRequest = error.config;
    const response = error.response;
    const status = response?.status;

    // Handle 401 Unauthorized globally
    if (status === 401) {
      const url = originalRequest?.url || '';
      // Don't show "Session expired" message for login attempts or initial auth checks
      if (!url.includes('/auth/login') && !url.includes('/auth/me')) {
        toast.error("Your session has expired. Please log in again.");
        console.warn("Unauthorized API call. Token may be missing or expired.");
      }
    } 
    
    // Handle generic 500 server errors
    if (status && status >= 500) {
      toast.error("Critical Server Error. Please contact support.");
      console.error("Critical Server Error:", error);
    }
    // Handle network errors (e.g., backend down)
    else if (!response && error.code === 'ERR_NETWORK') {
      toast.error("Network error. Please check your backend is running.");
    }
    // Handle 403 Forbidden 
    else if (status === 403) {
      // If there's a specific message from backend, the block below will handle it
      if (!response?.data) {
        toast.error("You don't have permission to perform this action.");
      }
    }

    // ALWAYS handle standard API specific error messages if they exist (e.g., 400, 401, 404)
    // but skip for /auth/me which checks silently on start
    // also skip for /listings as the component handles the toast update itself
    const isListings = originalRequest?.url?.includes('/listings');

    if (response?.data && (response.data as any).message && originalRequest?.url !== '/auth/me' && !isListings) {
      toast.error((response.data as any).message);
    }

    // Reject with an Error to prevent Next.js from logging empty objects {} for raw JS errors
    const errorData: any = response?.data || { message: error.message || "An unexpected error occurred" };
    const apiError = new Error(errorData.message || (typeof errorData === "string" ? errorData : JSON.stringify(errorData)));
    (apiError as any).response = errorData;
    
    return Promise.reject(apiError);
  }
);

export default apiClient;

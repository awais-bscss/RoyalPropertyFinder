import apiClient from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { SupportInquiry } from "@/components/dashboard/admin/types";

export interface InquiryData {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  type: string;
  subject: string;
  message: string;
}

export const InquiryService = {
  /**
   * Submit a new support inquiry from the contact page
   */
  submitInquiry: async (data: InquiryData): Promise<ApiResponse> => {
    return apiClient.post("/inquiries", data);
  },

  /**
   * Admin: Get inquiry stats
   */
  getInquiryStats: async (): Promise<ApiResponse> => {
    return apiClient.get("/inquiries/stats");
  },

  /**
   * Admin: Get all inquiries
   */
  getAllInquiries: async (params?: { type?: string; status?: string }): Promise<ApiResponse<SupportInquiry[]>> => {
    return apiClient.get("/inquiries", { params });
  },

  /**
   * Admin: Update inquiry status
   */
  updateInquiryStatus: async (id: string, status: string): Promise<ApiResponse> => {
    return apiClient.patch(`/inquiries/${id}/status`, { status });
  },

  /**
   * Admin: Update inquiry priority
   */
  updateInquiryPriority: async (id: string, priority: string): Promise<ApiResponse> => {
    return apiClient.patch(`/inquiries/${id}/priority`, { priority });
  },

  /**
   * Admin: Delete an inquiry
   */
  deleteInquiry: async (id: string): Promise<ApiResponse> => {
    return apiClient.delete(`/inquiries/${id}`);
  },

  /**
   * Admin: Send a reply to an inquiry via email
   */
  replyToInquiry: async (id: string, message: string): Promise<ApiResponse> => {
    return apiClient.post(`/inquiries/${id}/reply`, { message });
  },
};

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
  replyToInquiry: async (id: string, message: string, attachments: File[]): Promise<ApiResponse> => {
    if (!attachments || attachments.length === 0) {
      // If no files, we can still use JSON
      return apiClient.post(`/inquiries/${id}/reply`, { message });
    }
    
    const formData = new FormData();
    formData.append("message", message);
    
    // Append each file to the 'attachments' field
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    console.log("--- DEBUG: Final FormData for API ---");
    for (const [key, value] of (formData as any).entries()) {
      console.log(`- ${key}:`, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
    }
    
    return apiClient.post(`/inquiries/${id}/reply`, formData, {
      headers: { "Content-Type": undefined },
    });
  },

  deleteReply: async (id: string, replyId: string): Promise<ApiResponse> => {
    return apiClient.delete(`/inquiries/${id}/replies/${replyId}`);
  },
};

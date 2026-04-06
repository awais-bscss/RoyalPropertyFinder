import apiClient from "@/lib/axios";

export interface ListingInquiryData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export const ListingInquiryService = {
  /**
   * Submit an inquiry for a property listing
   */
  submitInquiry: async (listingId: string, data: ListingInquiryData) => {
    return apiClient.post(`/listing-inquiries/${listingId}/inquiry`, data);
  },

  /**
   * Get all inquiries for the logged-in user (as a seller)
   */
  getMyInquiries: async () => {
    return apiClient.get("/listing-inquiries/inquiries/me");
  },

  /**
   * Mark an inquiry as read
   */
  markAsRead: async (inquiryId: string) => {
    return apiClient.patch(`/listing-inquiries/inquiries/${inquiryId}/read`);
  },

  /**
   * Delete an inquiry
   */
  deleteInquiry: async (inquiryId: string) => {
    return apiClient.delete(`/listing-inquiries/inquiries/${inquiryId}`);
  },

  /**
   * Admin: Get ALL inquiries from all users
   */
  getAllListingInquiries: async () => {
    return apiClient.get("/listing-inquiries/inquiries/all");
  },

  /**
   * Update inquiry status (Admin: status body, Seller: mostly markAsRead wrapper)
   */
  updateStatus: async (inquiryId: string, status: string) => {
    return apiClient.patch(`/listing-inquiries/inquiries/${inquiryId}/status`, { status });
  },

  /**
   * Admin/Seller: Reply to an inquiry
   */
  replyToInquiry: async (inquiryId: string, message: string, attachments?: File[]) => {
    if (!attachments || attachments.length === 0) {
      return apiClient.post(`/listing-inquiries/inquiries/${inquiryId}/reply`, { message });
    }

    const formData = new FormData();
    formData.append("message", message);
    attachments.forEach((file) => formData.append("attachments", file));

    return apiClient.post(`/listing-inquiries/inquiries/${inquiryId}/reply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Admin/Seller: Delete a specific reply
   */
  deleteReply: async (inquiryId: string, replyId: string) => {
    return apiClient.delete(`/listing-inquiries/inquiries/${inquiryId}/replies/${replyId}`);
  },
};

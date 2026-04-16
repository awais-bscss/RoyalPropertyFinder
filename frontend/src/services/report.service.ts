import apiClient from "@/lib/axios";

export interface IListingReport {
  _id: string;
  listing: string;
  reporter: string;
  reason: "scam" | "inappropriate" | "misleading" | "other";
  description?: string;
  status: "pending" | "resolved" | "ignored";
  createdAt: string;
}

export const ReportService = {
  /**
   * Submit a report for a property
   */
  reportListing: async (listingId: string, data: { reason: string; description?: string }): Promise<any> => {
    const response = await apiClient.post(`/listing-reports/${listingId}`, data);
    return response.data;
  },

  /**
   * Get all reports (Admin only)
   */
  getAllReports: async (): Promise<any> => {
    const response = await apiClient.get("/listing-reports");
    return response.data;
  },

  /**
   * Update report status (Admin only)
   */
  updateReportStatus: async (id: string, status: string): Promise<any> => {
    const response = await apiClient.patch(`/listing-reports/${id}/status`, { status });
    return response.data;
  },

  /**
   * Delete a report (Admin only)
   */
  deleteReport: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/listing-reports/${id}`);
    return response.data;
  },
};

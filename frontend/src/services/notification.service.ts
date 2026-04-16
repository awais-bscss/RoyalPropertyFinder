import apiClient from "@/lib/axios";

export interface INotification {
  _id: string;
  recipient: string;
  sender?: any;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  success: boolean;
  count: number;
  data: INotification[];
}

export const NotificationService = {
  /**
   * Fetch all notifications for the current user
   */
  getMyNotifications: async (): Promise<NotificationResponse> => {
    const response = await apiClient.get<NotificationResponse>("/notifications");
    return response.data;
  },

  /**
   * Mark a specific notification as read
   */
  markAsRead: async (id: string): Promise<any> => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<any> => {
    const response = await apiClient.patch("/notifications/read-all");
    return response.data;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Clear all notifications
   */
  deleteAllNotifications: async (): Promise<any> => {
    const response = await apiClient.delete("/notifications/delete-all");
    return response.data;
  },
};

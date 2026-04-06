import axiosInstance from "../lib/axios";

export interface ISettings {
  _id: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
  updatedAt: string;
}

export interface ISettingsResponse {
  success: boolean;
  data: ISettings;
}

const SettingsService = {
  getSettings: async (fresh: boolean = false): Promise<ISettingsResponse> => {
    const url = fresh ? `/settings?t=${Date.now()}` : "/settings";
    return await axiosInstance.get(url);
  },

  updateSettings: async (data: { 
    contactEmail: string; 
    contactPhone: string; 
    contactAddress: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  }): Promise<ISettingsResponse> => {
    return await axiosInstance.patch("/settings", data);
  },
};

export default SettingsService;

import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  linkedin: string;
  updatedBy: mongoose.Types.ObjectId;
}

const settingsSchema: Schema = new Schema(
  {
    contactEmail: { type: String, required: true, default: "royalproperty@admin.com" },
    contactPhone: { type: String, required: true, default: "+92 300 1234567" },
    contactAddress: { type: String, required: true, default: "DHA Phase 6, Lahore" },
    facebook: { type: String, default: "https://facebook.com" },
    instagram: { type: String, default: "https://instagram.com" },
    youtube: { type: String, default: "https://youtube.com" },
    twitter: { type: String, default: "https://twitter.com" },
    linkedin: { type: String, default: "https://linkedin.com" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>("Settings", settingsSchema);

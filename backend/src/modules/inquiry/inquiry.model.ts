import mongoose, { Schema, Document } from "mongoose";

export interface IReply {
  message: string;
  adminName: string;
  attachments?: {
    filename: string;
    path: string;
  }[];
  createdAt: Date;
}

export interface IInquiry extends Document {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  type: "support" | "billing" | "report" | "advertising";
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high";
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    senderPhone: { type: String },
    type: {
      type: String,
      enum: ["support", "billing", "report", "advertising"],
      default: "support",
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    replies: [
      {
        message: { type: String, required: true },
        adminName: { type: String, required: true },
        attachments: [
          {
            filename: String,
            path: String,
          }
        ],
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IInquiry>("Inquiry", InquirySchema);

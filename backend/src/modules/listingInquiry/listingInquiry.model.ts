import mongoose, { Schema, Document } from "mongoose";

export interface IListingInquiry extends Document {
  listing: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  replies: {
    message: string;
    senderName: string;
    createdAt: Date;
    attachments?: {
      filename: string;
      path: string;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ListingInquirySchema: Schema = new Schema(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Listing ID is required"],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller ID is required"],
    },
    senderName: {
      type: String,
      required: [true, "Sender name is required"],
      trim: true,
    },
    senderEmail: {
      type: String,
      required: [true, "Sender email is required"],
      lowercase: true,
      trim: true,
    },
    senderPhone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied", "archived"],
      default: "unread",
    },
    replies: [
      {
        message: { type: String, required: true },
        senderName: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        attachments: [
          {
            filename: String,
            path: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexing for faster queries (Seller needs their inquiries often)
ListingInquirySchema.index({ seller: 1, createdAt: -1 });
ListingInquirySchema.index({ listing: 1 });

export default mongoose.model<IListingInquiry>("ListingInquiry", ListingInquirySchema);

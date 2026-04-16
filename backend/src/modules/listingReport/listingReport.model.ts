import mongoose, { Document, Model, Schema } from "mongoose";

export interface IListingReport extends Document {
  listing: mongoose.Types.ObjectId;
  reporter: mongoose.Types.ObjectId;
  reason: "scam" | "inappropriate" | "misleading" | "other";
  description?: string;
  status: "pending" | "resolved" | "ignored";
  createdAt: Date;
  updatedAt: Date;
}

const listingReportSchema = new Schema<IListingReport>(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: ["scam", "inappropriate", "misleading", "other"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "ignored"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const ListingReport: Model<IListingReport> = mongoose.model<IListingReport>(
  "ListingReport",
  listingReportSchema
);

export default ListingReport;

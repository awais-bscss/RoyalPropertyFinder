import mongoose, { Document, Model, Schema } from "mongoose";

export enum NotificationType {
  LISTING_SUBMITTED = "listing_submitted",
  LISTING_APPROVED = "listing_approved",
  LISTING_REJECTED = "listing_rejected",
  NEW_INQUIRY = "new_inquiry",
  INQUIRY_REPLIED = "inquiry_replied",
  ACCOUNT_SECURITY = "account_security",
  SYSTEM_ALERT = "system_alert",
  LISTING_REPORTED = "listing_reported",
  REPORT_RESOLVED = "report_resolved",
}

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;  // User who receives the notification
  sender?: mongoose.Types.ObjectId;     // User who triggered (e.g., inquirer, or admin if manually sent)
  type: NotificationType;
  title: string;
  message: string;
  link?: string;                       // URL to redirect when clicked
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;

import { z } from "zod";

export const createInquirySchema = z.object({
  senderName: z.string().min(2, "Name is too short"),
  senderEmail: z.string().email("Invalid email address"),
  senderPhone: z.string().optional(),
  type: z.enum(["support", "billing", "report", "advertising"]),
  subject: z.string().min(5, "Subject is too short"),
  message: z.string().min(10, "Message is too short"),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved"]),
});

export const replyInquirySchema = z.object({
  message: z.string().min(5, "Reply message is too short"),
});

export const updateInquiryPrioritySchema = z.object({
  priority: z.enum(["low", "medium", "high"]),
});

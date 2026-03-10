import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";
import Inquiry from "./inquiry.model";
import { createInquirySchema, updateInquiryStatusSchema, replyInquirySchema, updateInquiryPrioritySchema } from "./inquiry.validation";
import { sendEmail } from "../../shared/utils/email";

/**
 * @desc    Submit a new inquiry (Public)
 * @route   POST /api/v1/inquiries
 * @access  Public
 */
export const createInquiry = catchAsync(async (req: Request, res: Response) => {
  // 1. Validate against Zod schema
  const validatedData = createInquirySchema.parse(req.body);

  // 2. Persist to DB
  const inquiry = await Inquiry.create(validatedData);

  res.status(201).json({
    success: true,
    message: "Inquiry submitted successfully",
    data: inquiry,
  });
});

/**
 * @desc    Get all inquiries (Admin Only)
 * @route   GET /api/v1/inquiries
 * @access  Admin only
 */
export const getAllInquiries = catchAsync(async (req: Request, res: Response) => {
  const { type, status } = req.query;
  const filter: any = {};

  if (type && type !== "all") filter.type = type;
  if (status && status !== "all") filter.status = status;

  const inquiries = await Inquiry.find(filter).sort("-createdAt");

  res.status(200).json({
    success: true,
    count: inquiries.length,
    data: inquiries,
  });
});

/**
 * @desc    Update inquiry status (Admin Only)
 * @route   PATCH /api/v1/inquiries/:id/status
 * @access  Admin only
 */
export const updateInquiryStatus = catchAsync(async (req: Request, res: Response) => {
  // 1. Validate body
  const { status } = updateInquiryStatusSchema.parse(req.body);

  // 2. Find and update
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    throw new AppError("Inquiry not found", 404);
  }

  inquiry.status = status;
  await inquiry.save();

  res.status(200).json({
    success: true,
    message: `Inquiry status updated to ${status}`,
    data: inquiry,
  });
});

/**
 * @desc    Update inquiry priority (Admin Only)
 * @route   PATCH /api/v1/inquiries/:id/priority
 * @access  Admin only
 */
export const updateInquiryPriority = catchAsync(async (req: Request, res: Response) => {
  // 1. Validate body
  const { priority } = updateInquiryPrioritySchema.parse(req.body);

  // 2. Find and update
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    throw new AppError("Inquiry not found", 404);
  }

  inquiry.priority = priority as any;
  await inquiry.save();

  res.status(200).json({
    success: true,
    message: `Priority updated to ${priority}`,
    data: inquiry,
  });
});

/**
 * @desc    Delete an inquiry (Admin Only)
 * @route   DELETE /api/v1/inquiries/:id
 * @access  Admin only
 */
export const deleteInquiry = catchAsync(async (req: Request, res: Response) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  
  if (!inquiry) {
    throw new AppError("Inquiry not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Inquiry deleted successfully",
    data: {},
  });
});

/**
 * @desc    Get inquiry stats (Admin Only)
 * @route   GET /api/v1/inquiries/stats
 * @access  Admin only
 */
export const getInquiryStats = catchAsync(async (req: Request, res: Response) => {
  const [total, open, in_progress, resolved] = await Promise.all([
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ status: "open" }),
    Inquiry.countDocuments({ status: "in_progress" }),
    Inquiry.countDocuments({ status: "resolved" }),
  ]);

  res.status(200).json({
    success: true,
    data: { total, open, in_progress, resolved },
  });
});

/**
 * @desc    Reply to an inquiry (Admin Only)
 * @route   POST /api/v1/inquiries/:id/reply
 * @access  Admin only
 */
export const replyToInquiry = catchAsync(async (req: Request, res: Response) => {
  const { message } = replyInquirySchema.parse(req.body);

  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    throw new AppError("Inquiry not found", 404);
  }

  // Send Email
  await sendEmail({
    to: inquiry.senderEmail,
    subject: `Re: ${inquiry.subject} - Royal Property Finder Support`,
    text: message,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hello ${inquiry.senderName},</h2>
        <p>Thank you for reaching out to Royal Property Finder. Here is our response to your inquiry:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p>Best regards,<br><strong>Royal Property Finder Support Team</strong></p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="font-size: 12px; color: #777;">
          Original Inquiry:<br>
          <em>${inquiry.message}</em>
        </p>
      </div>
    `,
  });

  // Save reply to DB
  inquiry.replies.push({
    message,
    adminName: (req as any).user?.name || "Admin Support",
    createdAt: new Date(),
  });

  // Optionally update status to in_progress if it was open
  if (inquiry.status === "open") {
    inquiry.status = "in_progress";
  }
  
  await inquiry.save();

  res.status(200).json({
    success: true,
    message: "Reply sent successfully",
  });
});


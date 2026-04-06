import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";
import ListingInquiry from "./listingInquiry.model";
import Listing from "../listing/listing.model";
import { sendEmail } from "../../shared/utils/email";
import path from "path";
import User from "../user/user.model";

/**
 * @desc    Submit an inquiry for a property listing
 * @route   POST /api/v1/listings/:id/inquiry
 * @access  Public
 */
export const createInquiry = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, message } = req.body;

  // 1. Check if listing exists
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  // 2. Create inquiry linked to listing and seller
  const inquiry = await ListingInquiry.create({
    listing: listing._id,
    seller: listing.user,
    senderName: name,
    senderEmail: email,
    senderPhone: phone || "",
    message: message || "Interested in this property. Please call back.",
  });

  res.status(201).json({
    success: true,
    message: "Inquiry sent successfully to the property owner.",
    data: inquiry,
  });
});

/**
 * @desc    Get all inquiries for the logged-in seller
 * @route   GET /api/v1/listings/inquiries/me
 * @access  Private (Seller/Agent)
 */
export const getMyInquiries = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user._id;

  const inquiries = await ListingInquiry.find({ seller: userId })
    .populate("listing", "title images location price currency")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    data: inquiries,
  });
});

/**
 * @desc    Mark inquiry as read
 * @route   PATCH /api/v1/listings/inquiries/:inquiryId/read
 * @access  Private
 */
export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { inquiryId } = req.params;

  // Admins can mark any as read, sellers only their own
  const query = user.role === "admin" 
    ? { _id: inquiryId } 
    : { _id: inquiryId, seller: user._id };

  const inquiry = await ListingInquiry.findOneAndUpdate(
    query,
    { status: "read" },
    { new: true }
  );

  if (!inquiry) {
    throw new AppError("Inquiry not found or access denied", 404);
  }

  res.status(200).json({
    success: true,
    data: inquiry,
  });
});

/**
 * @desc    Admin/Seller: Update status of property inquiry
 * @route   PATCH /api/v1/listings/inquiries/:inquiryId/status
 * @access  Private
 */
export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { inquiryId } = req.params;
  const { status } = req.body;
  const user = (req as any).user;

  if (!["unread", "read", "replied", "archived"].includes(status)) {
    throw new AppError("Invalid status value", 400);
  }

  // Admins can update any, sellers only their own
  const query = user.role === "admin" 
    ? { _id: inquiryId } 
    : { _id: inquiryId, seller: user._id };

  const inquiry = await ListingInquiry.findOneAndUpdate(
    query,
    { status },
    { new: true, runValidators: true }
  );

  if (!inquiry) {
    throw new AppError("Inquiry not found or access denied", 404);
  }

  res.status(200).json({
    success: true,
    data: inquiry,
  });
});

/**
 * @desc    Delete a property inquiry
 * @route   DELETE /api/v1/listings/inquiries/:inquiryId
 * @access  Private
 */
export const deleteInquiry = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { inquiryId } = req.params;

  // Admins can delete any, sellers only their own
  const query = user.role === "admin" 
    ? { _id: inquiryId } 
    : { _id: inquiryId, seller: user._id };

  const inquiry = await ListingInquiry.findOneAndDelete(query);

  if (!inquiry) {
    throw new AppError("Inquiry not found or access denied", 404);
  }

  res.status(204).json({
    success: true,
    data: null,
  });
});

/**
 * @desc    Get ALL property inquiries (Admin only)
 * @route   GET /api/v1/listings/inquiries/all
 * @access  Private (Admin)
 */
export const getAllListingInquiries = catchAsync(async (req: Request, res: Response) => {
  const inquiries = await ListingInquiry.find()
    .populate("listing", "title images location price currency")
    .populate("seller", "name email phone")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    data: inquiries,
  });
});

/**
 * @desc    Reply to a property inquiry
 * @route   POST /api/v1/listings/inquiries/:inquiryId/reply
 * @access  Private (Seller/Admin)
 */
export const replyToPropertyInquiry = catchAsync(async (req: Request, res: Response) => {
  const { inquiryId } = req.params;
  const { message } = req.body;
  const user = (req as any).user;

  // 1. Find inquiry and verify access
  const inquiry = await ListingInquiry.findById(inquiryId).populate("listing", "title");
  if (!inquiry) {
    throw new AppError("Inquiry not found", 404);
  }

  // Sellers can only reply to their own, Admins can reply to any
  if (user.role !== "admin" && inquiry.seller.toString() !== user._id.toString()) {
    throw new AppError("Access denied", 403);
  }

  // 2. Prepare Attachments if any
  const files = ((req as any).files as any[]) || [];
  const attachments = files.map((f: any) => ({
    filename: f.originalname,
    path: `/uploads/attachments/${f.filename}`,
  }));

  // 3. Log reply in history FIRST to ensure persistence
  if (!inquiry.replies) inquiry.replies = [];
  inquiry.replies.push({
    message,
    senderName: user.name || "Property Owner/Agent",
    attachments, // Store attachments in DB
    createdAt: new Date(),
  });

  inquiry.status = "replied";
  await inquiry.save();

  // 4. Send email to the buyer (sender) in background (fail-safe)
  // We don't 'await' this to keep the UI snappy, or handle errors separately
  sendEmail({
    email: inquiry.senderEmail,
    subject: `Re: Inquiry for ${ (inquiry.listing as any).title } - Royal Property Finder`,
    message: message,
    attachments, // Simplified: already correctly formatted
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Royal Property Finder</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">Hello ${inquiry.senderName},</h2>
          <p style="font-size: 16px;">A property owner/agent responded to your inquiry about <strong>${(inquiry.listing as any).title}</strong>:</p>
          <div style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #4f46e5; margin: 25px 0; border-radius: 4px; font-style: italic; color: #334155;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          ${attachments.length > 0 ? `<p style="font-size: 14px; font-weight: bold; color: #64748b;">📎 ${attachments.length} files were attached to this message.</p>` : ""}
          <p style="margin-top: 30px; font-size: 15px;">You can contact them directly or reply to this email for further discussion.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="font-size: 13px; color: #94a3b8; text-align: center;">
            This is an automated response from Royal Property Finder.<br/>
            &copy; 2026 Royal Property Finder. All rights reserved.
          </p>
        </div>
      </div>
    `,
  }).catch(err => {
    console.error("Delayed email delivery failed:", err);
    // Note: The message is already saved in DB, so the process is a success regardless
  });

  res.status(200).json({
    success: true,
    message: "Reply sent successfully",
    data: inquiry,
  });
});

/**
 * @desc    Delete a specific reply from property inquiry (Admin/Seller)
 * @route   DELETE /api/v1/listings/inquiries/:inquiryId/replies/:replyId
 * @access  Private
 */
export const deleteReply = catchAsync(async (req: Request, res: Response) => {
  const { inquiryId, replyId } = req.params;
  const user = (req as any).user;

  const inquiry = await ListingInquiry.findById(inquiryId);
  if (!inquiry) {
    throw new AppError("Inquiry not found", 404);
  }

  // Sellers can only delete from their own inquiries
  if (user.role !== "admin" && inquiry.seller.toString() !== user._id.toString()) {
    throw new AppError("Access denied", 403);
  }

  // Use Mongoose pull 
  const replyToRemove = (inquiry.replies as any).id(replyId);
  if (!replyToRemove) {
    throw new AppError("Reply not found", 404);
  }

  replyToRemove.deleteOne();
  await inquiry.save();

  res.status(200).json({
    success: true,
    message: "Reply deleted successfully",
  });
});

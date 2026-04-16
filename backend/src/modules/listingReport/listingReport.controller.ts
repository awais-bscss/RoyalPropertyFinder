import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";
import ListingReport from "./listingReport.model";
import Listing from "../listing/listing.model";
import User from "../user/user.model";
import Notification, { NotificationType } from "../notification/notification.model";

/**
 * @desc    Submit a report for a property listing
 * @route   POST /api/v1/listing-reports/:listingId
 * @access  Private
 */
export const createReport = catchAsync(async (req: Request, res: Response) => {
  const { listingId } = req.params;
  const { reason, description } = req.body;
  const user = (req as any).user;

  // 1. Check if listing exists
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  // 2. Create the report
  const report = await ListingReport.create({
    listing: listingId,
    reporter: user._id,
    reason,
    description,
  });

  // 3. Notify all Admins about the new report
  try {
    // Find all users with role 'admin'
    const admins = await User.find({ role: "admin" }).select("_id");
    console.log(`[Report] Searching for Admins. Found: ${admins.length}`);
    
    const notifications = [];

    // Notify Admins
    if (admins.length > 0) {
      admins.forEach(admin => {
        notifications.push({
          recipient: admin._id,
          sender: user._id,
          type: NotificationType.LISTING_REPORTED,
          title: "🚨 New Property Report",
          message: `Listing "${listing.title}" reported for ${reason.toUpperCase()}.`,
          link: `/dashboard/admin/reports`,
        });
      });
    }

    // Also notify the Reporter (Confirmation)
    notifications.push({
      recipient: user._id,
      type: NotificationType.SYSTEM_ALERT,
      title: "🛡️ Report Submitted",
      message: `Your report for "${listing.title}" has been received. Our team will review it shortly.`,
      link: `/properties/${listing._id}`,
    });

    const created = await Notification.insertMany(notifications);
    
  } catch (error) {
    console.error("[Notification ERROR] CRITICAL FAILURE:", error);
  }

  res.status(201).json({
    success: true,
    message: "Report submitted successfully. Administrators will review it.",
    data: report,
  });
});

/**
 * @desc    Get all reports (Admin only)
 * @route   GET /api/v1/listing-reports
 * @access  Private (Admin)
 */
export const getAllReports = catchAsync(async (req: Request, res: Response) => {
  const reports = await ListingReport.find()
    .populate("listing", "title images price location currency")
    .populate("reporter", "name email")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports,
  });
});

/**
 * @desc    Update report status (Admin only)
 * @route   PATCH /api/v1/listing-reports/:id/status
 * @access  Private (Admin)
 */
export const updateReportStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "resolved", "ignored"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const report = await ListingReport.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  if (status === "resolved") {
    try {
      // Re-fetch with population to get the listing title
      const populated = await ListingReport.findById(report._id).populate("listing", "title");
      if (populated && populated.listing) {
        await Notification.create({
          recipient: report.reporter,
          type: NotificationType.REPORT_RESOLVED,
          title: "✅ Report Resolved",
          message: `Your report for "${(populated.listing as any).title}" has been reviewed and resolved. thank you for helping keep the platform safe!`,
          link: `/properties/${report.listing}`,
        });
      }
    } catch (err) {
      console.error("Failed to notify reporter about resolution:", err);
    }
  }

  res.status(200).json({
    success: true,
    message: `Report marked as ${status}`,
    data: report,
  });
});

/**
 * @desc    Delete a report (Admin only)
 * @route   DELETE /api/v1/listing-reports/:id
 * @access  Private (Admin)
 */
export const deleteReport = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const report = await ListingReport.findByIdAndDelete(id);

  if (!report) {
    throw new AppError("Report not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Report deleted successfully",
  });
});

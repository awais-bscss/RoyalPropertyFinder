import { Request, Response } from "express";
import { Settings } from "./settings.model";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";

/**
 * @desc    Get Site Settings
 * @route   GET /api/v1/settings
 * @access  Public
 */
export const getSettings = catchAsync(async (req: Request, res: Response) => {
  let settings = await Settings.findOne({});

  if (!settings) {
    settings = await Settings.create({
      contactEmail: "royalproperty@admin.com",
      contactPhone: "+92 300 1234567",
      contactAddress: "DHA Phase 6, Lahore",
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com"
    });
  }

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update Global Settings
 * @route   PATCH /api/v1/settings
 * @access  Private/Admin
 */
export const updateSettings = catchAsync(async (req: Request, res: Response) => {
  const { 
    contactEmail, 
    contactPhone, 
    contactAddress,
    facebook,
    instagram,
    youtube,
    twitter,
    linkedin
  } = req.body;

  // Find the singleton settings doc or create it
  let settings = await Settings.findOneAndUpdate(
    {}, // Filter: just the first one
    {
      contactEmail,
      contactPhone,
      contactAddress,
      facebook,
      instagram,
      youtube,
      twitter,
      linkedin,
      updatedBy: (req as any).user._id
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Global configuration updated successfully",
    data: settings
  });
});

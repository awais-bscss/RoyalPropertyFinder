import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";
import Notification from "./notification.model";

/**
 * @desc    Get current user's notifications
 * @route   GET /api/v1/notifications
 * @access  Private
 */
export const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  
  if (!user || !user._id) {
    throw new AppError("Not authorized", 401);
  }

  const notifications = await Notification.find({ recipient: user._id })
    .sort("-createdAt")
    .limit(50); // Limit to last 50 for performance

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/v1/notifications/:id/read
 * @access  Private
 */
export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;

  const notification = await Notification.findOne({
    _id: id,
    recipient: user._id,
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: notification,
  });
});

/**
 * @desc    Mark all user notifications as read
 * @route   PATCH /api/v1/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  await Notification.updateMany(
    { recipient: user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/v1/notifications/:id
 * @access  Private
 */
export const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;

  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipient: user._id,
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});

/**
 * @desc    Delete all user notifications
 * @route   DELETE /api/v1/notifications
 * @access  Private
 */
export const deleteAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  await Notification.deleteMany({ recipient: user._id });

  res.status(200).json({
    success: true,
    message: "All notifications cleared successfully",
  });
});

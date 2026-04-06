import { Request, Response } from "express";
import { catchAsync } from "../../../shared/utils/catchAsync";
import User from "../../user/user.model";
import Listing from "../../listing/listing.model";
import redisClient from "../../../config/redis";

/**
 * @desc    Deactivate current account
 */
export const deactivateAccount = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  await User.findByIdAndUpdate(user._id, { status: "deactivated" });

  const keys = await redisClient.keys(`session:${user._id.toString()}:*`);
  for (const key of keys) await redisClient.del(key);

  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ success: true, message: "Account deactivated successfully." });
});

/**
 * @desc    Delete current account permanently
 */
export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  await Listing.deleteMany({ user: user._id });

  const keys = await redisClient.keys(`session:${user._id.toString()}:*`);
  for (const key of keys) await redisClient.del(key);

  await User.findByIdAndDelete(user._id);

  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ success: true, message: "Account and data permanently deleted." });
});

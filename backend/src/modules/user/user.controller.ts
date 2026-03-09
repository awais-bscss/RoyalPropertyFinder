import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";
import User from "./user.model";
import Listing from "../listing/listing.model";

/**
 * @desc    Admin: Get all users with their listing counts
 * @route   GET /api/v1/users/admin/all
 * @access  Admin only
 */
export const adminGetAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { role, search } = req.query;

  const filter: Record<string, unknown> = {};
  if (role && role !== "all") filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter).sort("-createdAt").lean();

  // Attach listing count for each user
  const usersWithCounts = await Promise.all(
    users.map(async (u) => {
      const listingCount = await Listing.countDocuments({ user: u._id });
      return { ...u, listingCount };
    })
  );

  res.status(200).json({
    success: true,
    count: usersWithCounts.length,
    data: usersWithCounts,
  });
});

/**
 * @desc    Admin: Get platform-wide stats (for overview dashboard)
 * @route   GET /api/v1/users/admin/platform-stats
 * @access  Admin only
 */
export const adminGetPlatformStats = catchAsync(async (req: Request, res: Response) => {
  const [totalUsers, totalAdmins, totalAgents, newUsersThisMonth] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ role: "agent" }),
    User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) }, // since 1st of this month
    }),
  ]);

  res.status(200).json({
    success: true,
    data: { totalUsers, totalAdmins, totalAgents, newUsersThisMonth },
  });
});

/**
 * @desc    Admin: Update a user's role
 * @route   PATCH /api/v1/users/admin/:id/role
 * @access  Admin only
 */
export const adminUpdateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { role } = req.body;
  const currentAdmin = (req as any).user;

  if (!["user", "admin", "agent"].includes(role)) {
    throw new AppError("Invalid role. Must be user, admin, or agent.", 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found", 404);

  // Prevent admin from demoting themselves
  if (user._id.toString() === currentAdmin._id.toString()) {
    throw new AppError("You cannot change your own role.", 403);
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    data: user,
  });
});

/**
 * @desc    Admin: Delete a user account (and their listings)
 * @route   DELETE /api/v1/users/admin/:id
 * @access  Admin only
 */
export const adminDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const currentAdmin = (req as any).user;
  const user = await User.findById(req.params.id);

  if (!user) throw new AppError("User not found", 404);

  if (user._id.toString() === currentAdmin._id.toString()) {
    throw new AppError("You cannot delete your own admin account.", 403);
  }

  // Delete all their listings too
  await Listing.deleteMany({ user: user._id });
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User and all their listings have been permanently deleted.",
    data: {},
  });
});

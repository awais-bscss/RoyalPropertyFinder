import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../shared/errors/AppError";
import { catchAsync } from "../../shared/utils/catchAsync";
import User from "../../modules/user/user.model";

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // 1. Get token and check if it exists in cookies or headers (Bearer)
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  // 2. Verify token
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
  } catch (error) {
    return next(new AppError("Invalid or expired token. Please log in again.", 401));
  }

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

/**
 * @desc    Restrict access to verified users only
 */
export const requireVerified = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  // Hardcoded: Admin is always verified
  if (user && user.role === "admin") {
    return next();
  }

  if (!user || !user.isEmailVerified) {
    return next(new AppError("Please verify your email address to unlock this feature.", 403));
  }
  next();
};

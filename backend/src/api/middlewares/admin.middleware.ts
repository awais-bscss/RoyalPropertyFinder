import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";
import { catchAsync } from "../../shared/utils/catchAsync";

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Already handled in auth.middleware.ts — re-export from there
  next();
});

/**
 * Middleware to require admin role
 */
export const requireAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== "admin") {
    return next(new AppError("Access denied. Admin privileges required.", 403));
  }
  next();
});

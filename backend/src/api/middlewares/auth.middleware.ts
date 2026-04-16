import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../shared/errors/AppError";
import { catchAsync } from "../../shared/utils/catchAsync";
import User from "../../modules/user/user.model";
import redisClient from "../../config/redis";

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
  
  // 3. Optional but highly recommended: verify session still exists in Redis
  if (decoded.sessionId) {
    try {
      // Add a 5s timeout to Redis check to prevent hanging requests if Redis is slow/down
      const sessionData = await Promise.race([
        redisClient.get(`session:${decoded.id.toString()}:${decoded.sessionId}`),
        new Promise<null>((_, reject) => 
          setTimeout(() => reject(new Error("Redis Timeout")), 5000)
        )
      ]);

      if (!sessionData) {
        return next(new AppError("Your session has expired. Please log in again.", 401));
      }
      
      const parsedSession = JSON.parse(sessionData);
      if (parsedSession.status === 'revoked') {
        return next(new AppError("Your session has been revoked. Please log in again.", 401));
      }
      
      // Attach current sessionId for controllers to know which device this request came from
      (req as any).sessionId = decoded.sessionId;
    } catch (redisError: any) {
      console.error("[Auth Middleware] Session check failed/timed out:", redisError.message);
      // Fail safely: if Redis is down, we don't let the request hang. 
      // We assume the session is invalid for security if we can't verify it.
      return next(new AppError("Unable to verify session. Please try again or re-login.", 401));
    }
  }

  // 4. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }

  // 4b. Check if account is deactivated
  if (currentUser.status === "deactivated") {
    return next(new AppError("This account has been deactivated. Please contact support to restore your access.", 403));
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

/**
 * @desc    Restrict access based on user role
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return next(new AppError("You do not have permission to perform this action.", 403));
    }
    next();
  };
};

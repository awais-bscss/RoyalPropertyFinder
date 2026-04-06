import { Request, Response } from "express";
import { catchAsync } from "../../../shared/utils/catchAsync";
import { AppError } from "../../../shared/errors/AppError";
import { createSessionToken, cookieOptions } from "../auth.utils";

/**
 * @desc    Google OAuth Callback success handler
 */
export const googleOAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  if (!user) throw new AppError("Authentication failed", 401);

  if (!user.isEmailVerified) {
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });
  }

  const token = await createSessionToken(req, user, true);
  res.cookie("token", token, cookieOptions);

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/?login=success`);
});

/**
 * @desc    Facebook OAuth Callback success handler
 */
export const facebookOAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  if (!user) throw new AppError("Authentication failed", 401);

  if (!user.isEmailVerified) {
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });
  }

  const token = await createSessionToken(req, user, true);
  res.cookie("token", token, cookieOptions);

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/?login=success`);
});

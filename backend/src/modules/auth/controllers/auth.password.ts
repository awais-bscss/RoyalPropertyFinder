import { Request, Response } from "express";
import crypto from "crypto";
import { catchAsync } from "../../../shared/utils/catchAsync";
import { AppError } from "../../../shared/errors/AppError";
import User from "../../user/user.model";
import { forgotPasswordSchema, resetPasswordSchema, updatePasswordSchema } from "../auth.validation";
import { sendEmail } from "../../../shared/utils/email";
import { cookieOptions } from "../auth.utils";
import { generateToken } from "../../../shared/utils/jwt";

/**
 * @desc    Request password reset link
 */
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = forgotPasswordSchema.parse(req.body);
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent.",
      devHint: process.env.NODE_ENV === "development" ? "Email was not found in DB. No reset link generated." : undefined,
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;
  const isDev = process.env.NODE_ENV === "development";

  const message = `Forgot your password? Click the link to reset: ${resetURL}.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1e293b; text-align: center;">Royal Property Finder</h2>
      <p>Hello,</p>
      <p>You requested to reset your password. This link is valid for <strong>1 hour</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="background-color: #0c4a6e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset Password</a>
      </div>
      <p>If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777; text-align: center;">Royal Property Finder &copy; 2026. All rights reserved.</p>
    </div>
  `;

  if (isDev) console.log(`PASSWORD RESET LINK (DEV): ${resetURL}`);

  try {
    await sendEmail({ email: user.email, subject: "Password Reset Request - Royal Property Finder", message, html });
  } catch (emailErr) {
    console.error("EMAIL SEND ERROR:", (emailErr as any).message);
    if (!isDev) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError("There was an error sending the email. Try again later!", 500);
    }
  }

  res.status(200).json({ success: true, message: "If an account exists with this email, a reset link has been sent." });
});

/**
 * @desc    Reset password using token
 */
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token as string).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) throw new AppError("Reset link is invalid or has expired", 400);

  const { password } = resetPasswordSchema.parse(req.body);
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successful. You can now log in." });
});

/**
 * @desc    Update password for authenticated users
 */
export const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById((req.user as any)?._id).select("+password");
  if (!user) throw new AppError("The user no longer exists.", 401);

  if (!user.password) {
    const provider = user.authProvider === "google" ? "Google" : "Facebook";
    throw new AppError(`You registered using ${provider}. Please use "Forgot Password" to set a manual password first.`, 400);
  }

  const { currentPassword, password } = updatePasswordSchema.parse(req.body);
  if (!(await user.comparePassword(currentPassword))) throw new AppError("Your current password is wrong", 401);

  user.password = password;
  await user.save();

  const token = generateToken({ id: user._id });
  res.cookie("token", token, cookieOptions);

  res.status(200).json({ success: true, message: "Password updated successfully." });
});

/**
 * @desc    Verify email using token
 */
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token as string).digest("hex");
  const user = await User.findOne({ emailVerificationToken: hashedToken, emailVerificationExpires: { $gt: new Date() } });
  if (!user) throw new AppError("Verification link is invalid or has expired.", 400);

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/verify-email/success`);
});

/**
 * @desc    Resend verification email
 */
export const resendVerification = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user._id).select("+emailVerificationToken +emailVerificationExpires");
  if (!user) throw new AppError("User not found", 404);
  if (user.isEmailVerified) throw new AppError("Email is already verified", 400);

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  const verifyURL = `${backendUrl}/api/v1/auth/verify-email/${verificationToken}`;
  
  if (process.env.NODE_ENV === "development") console.log(`RESENT VERIFICATION LINK (DEV): ${verifyURL}`);

  const message = `Please verify your email address by clicking the link: ${verifyURL}.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1e293b; text-align: center;">Verify Your Email Address</h2>
      <p>Hello ${user.name},</p>
      <p>You requested a new verification link. Please click below to confirm your account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyURL}" style="background-color: #0c4a6e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
      </div>
      <p>Valid for 24 hours.</p>
    </div>
  `;

  await sendEmail({ email: user.email, subject: "Verify Your Email - Royal Property Finder", message, html });

  res.status(200).json({ success: true, message: "Verification email sent successfully!" });
});

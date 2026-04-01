import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";
import { generateToken } from "../../shared/utils/jwt";
import crypto from "crypto";

import User from "../user/user.model";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updatePasswordSchema } from "./auth.validation";
import { sendEmail } from "../../shared/utils/email";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email: validatedData.email });
  if (existingUser) {
    if (existingUser.authProvider !== "email") {
      const provider = existingUser.authProvider === "google" ? "Google" : "Facebook";
      throw new AppError(`This email is already associated with a ${provider} account. Please log in using ${provider}.`, 400);
    }
    throw new AppError("Email already registered", 400);
  }

  const user = await User.create({
    name: validatedData.name,
    email: validatedData.email,
    phone: validatedData.phone,
    password: validatedData.password,
    authProvider: "email",
    isEmailVerified: false, // Explicitly false for email signups
  });

  // 4. Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save({ validateBeforeSave: false });

  // 5. Send verification email
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  const verifyURL = `${backendUrl}/api/v1/auth/verify-email/${verificationToken}`;
  const isDev = process.env.NODE_ENV === "development";

  const message = `Welcome to Royal Property Finder! Please verify your email by clicking the link: ${verifyURL}.\nIf you didn't create an account, ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1e293b; text-align: center;">Welcome to Royal Property Finder</h2>
      <p>Hello ${user.name},</p>
      <p>Thank you for joining our platform! To get started, please verify your email address by clicking the button below.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyURL}" style="background-color: #0c4a6e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
      </div>
      <p>This link is valid for <strong>24 hours</strong>. If you did not create an account, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777; text-align: center;">Royal Property Finder &copy; 2026. All rights reserved.</p>
    </div>
  `;

  if (isDev) {
    console.log("\n------------------------------------------");
    console.log(`EMAIL VERIFICATION LINK (DEV): ${verifyURL}`);
    console.log("------------------------------------------\n");
  }

  try {
    await sendEmail({ email: user.email, subject: "Verify Your Email - Royal Property Finder", message, html });
  } catch (emailErr: any) {
    console.error("VERIFICATION EMAIL ERROR:", emailErr.message);
    // Non-blocking in dev, hard error in production
  }

  const token = generateToken({ id: user._id });
  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "User registered! Please check your email to verify your account.",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    }
  });
});

/**
 * @desc    Login a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const user = await User.findOne({ email: validatedData.email }).select("+password");

  if (user && !user.password) {
    const provider = user.authProvider === "google" ? "Google" : user.authProvider === "facebook" ? "Facebook" : "social login";
    throw new AppError(
      `This account was created using ${provider}. Please click "Continue with ${provider}" to sign in.`,
      401
    );
  }

  if (!user || !(await user.comparePassword(validatedData.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({ id: user._id });
  const expires = validatedData.rememberMe 
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    : undefined;

  res.cookie("token", token, {
    ...cookieOptions,
    expires,
    maxAge: validatedData.rememberMe ? cookieOptions.maxAge : undefined
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
});

/**
 * @desc    Google OAuth Callback success handler
 * @route   GET /api/v1/auth/google/callback
 */
export const googleOAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  if (!user) throw new AppError("Authentication failed", 401);

  // Mark as verified if not already
  if (!user.isEmailVerified) {
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });
  }

  const token = generateToken({ id: user.id });
  res.cookie("token", token, cookieOptions);

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/?login=success`);
});

/**
 * @desc    Facebook OAuth Callback success handler
 * @route   GET /api/v1/auth/facebook/callback
 */
export const facebookOAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;
  if (!user) throw new AppError("Authentication failed", 401);

  // Mark as verified if not already
  if (!user.isEmailVerified) {
    user.isEmailVerified = true;
    await user.save({ validateBeforeSave: false });
  }

  const token = generateToken({ id: user.id });
  res.cookie("token", token, cookieOptions);

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/?login=success`);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = catchAsync(async (req: Request, res: Response) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: {}
  });
});

/**
 * @desc    Request password reset link
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  // 1. Validate request
  const { email } = forgotPasswordSchema.parse(req.body);

  // 2. Find user
  const user = await User.findOne({ email });
  if (!user) {
    // For security, don't reveal if user exists. Just return a success message.
    return res.status(200).json({
      success: true,
      message: "If an account exists with this email, a reset link has been sent.",
      devHint: process.env.NODE_ENV === "development" ? "Email was not found in DB. No reset link generated." : undefined,
    });
  }

  // To support social users setting a local password, we don't throw an error here anymore.
  // Instead, the reset flow will just give them a valid password, updating the DB, allowing dual-login!

  // 3. Generate random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // 4. Save hashed token and expiration (1 hour)
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  // 5. Send Email (fire and forget in dev, blocking in production)
  const resetURL = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${resetToken}`;
  const isDev = process.env.NODE_ENV === "development";

  const message = `Forgot your password? Click the link to reset: ${resetURL}.\nIf you didn't request this, ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1e293b; text-align: center;">Royal Property Finder</h2>
      <p>Hello,</p>
      <p>You are receiving this email because you requested to reset your password.</p>
      <p>Please click the button below. This link is valid for <strong>1 hour</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="background-color: #0c4a6e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset Password</a>
      </div>
      <p>If you did not request this, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777; text-align: center;">Royal Property Finder &copy; 2026. All rights reserved.</p>
    </div>
  `;

  // Always log link to console in dev for easy testing
  if (isDev) {
    console.log("\n------------------------------------------");
    console.log(`PASSWORD RESET LINK (DEV): ${resetURL}`);
    console.log("------------------------------------------\n");
  }

  // Try sending email — in dev, failure is non-blocking
  try {
    await sendEmail({ email: user.email, subject: "Password Reset Request - Royal Property Finder", message, html });
  } catch (emailErr: any) {
    console.error("EMAIL SEND ERROR:", emailErr.message);
    // In production, this is a hard error; in dev, we swallow it and return the link
    if (!isDev) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError("There was an error sending the email. Try again later!", 500);
    }
  }

  res.status(200).json({
    success: true,
    message: "If an account exists with this email, a reset link has been sent.",
  });
});

/**
 * @desc    Reset password using token
 * @route   PATCH /api/v1/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token as string).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Reset link is invalid or has expired", 400);
  }

  const { password } = resetPasswordSchema.parse(req.body);
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful. You can now log in.",
  });
});

/**
 * @desc    Update password for authenticated users
 * @route   PATCH /api/v1/auth/update-password
 * @access  Private
 */
export const updatePassword = catchAsync(async (req: Request, res: Response) => {
  // 1. Get user from db with password
  const user = await User.findById((req.user as any)?._id).select("+password");

  if (!user) {
    throw new AppError("The user belonging to this session no longer exists.", 401);
  }

  // 1a. Block social users who haven't set a manual password yet
  if (!user.password) {
    const provider = user.authProvider === "google" ? "Google" : "Facebook";
    throw new AppError(
      `You registered using ${provider}. Please use the "Forgot Password" feature on the login screen to set an initial password.`,
      400
    );
  }

  // 2. Validate request body
  const { currentPassword, password } = updatePasswordSchema.parse(req.body);

  // 3. Check if current password is correct
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError("Your current password is wrong", 401);
  }

  // 4. Update the password
  user.password = password;
  await user.save();

  // 5. Optionally generate a new token and update cookie so they aren't logged out
  const token = generateToken({ id: user._id });
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});

/**
 * @desc    Verify email using token
 * @route   GET /api/v1/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token as string).digest("hex");
  
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Verification link is invalid or has expired.", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // Redirect to a dedicated success page
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/verify-email/success`);
});

/**
 * @desc    Resend verification email
 * @route   POST /api/v1/auth/resend-verification
 * @access  Private
 */
export const resendVerification = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user._id).select("+emailVerificationToken +emailVerificationExpires");
  if (!user) throw new AppError("User not found", 404);

  if (user.isEmailVerified) {
    throw new AppError("Email is already verified", 400);
  }

  // Generate new token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  // Send email
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  const verifyURL = `${backendUrl}/api/v1/auth/verify-email/${verificationToken}`;
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log(`RESENT VERIFICATION LINK (DEV): ${verifyURL}`);
  }

  const message = `Please verify your email address by clicking the link: ${verifyURL}.\nThis link is valid for 24 hours.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="color: #1e293b; text-align: center;">Verify Your Email Address</h2>
      <p>Hello ${user.name},</p>
      <p>You requested a new verification link for your Royal Property Finder account. Please click the button below to confirm your email.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyURL}" style="background-color: #0c4a6e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
      </div>
      <p>This link will expire in 24 hours.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #777; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  await sendEmail({ email: user.email, subject: "Verify Your Email - Royal Property Finder", message, html });

  res.status(200).json({
    success: true,
    message: "Verification email sent successfully!",
  });
});

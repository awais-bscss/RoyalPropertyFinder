import { Request, Response } from "express";
import crypto from "crypto";
import { catchAsync } from "../../../shared/utils/catchAsync";
import { AppError } from "../../../shared/errors/AppError";
import User from "../../user/user.model";
import { registerSchema, loginSchema } from "../auth.validation";
import { sendEmail } from "../../../shared/utils/email";
import { createSessionToken, cookieOptions } from "../auth.utils";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
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
    isEmailVerified: false,
  });

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save({ validateBeforeSave: false });

  const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  const verifyURL = `${backendUrl}/api/v1/auth/verify-email/${verificationToken}`;
  const isDev = process.env.NODE_ENV === "development";

  const message = `Welcome to Royal Property Finder! Please verify your email by clicking the link: ${verifyURL}.`;
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

  if (isDev) console.log(`EMAIL VERIFICATION LINK (DEV): ${verifyURL}`);

  try {
    await sendEmail({ email: user.email, subject: "Verify Your Email - Royal Property Finder", message, html });
  } catch (emailErr) {
    console.error("VERIFICATION EMAIL ERROR:", (emailErr as any).message);
  }

  const token = await createSessionToken(req, user);
  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "User registered! Please check your email to verify your account.",
    data: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified }
  });
});

/**
 * @desc    Login a user
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const user = await User.findOne({ email: validatedData.email }).select("+password");

  if (user && !user.password) {
    const provider = user.authProvider === "google" ? "Google" : user.authProvider === "facebook" ? "Facebook" : "social login";
    throw new AppError(`This account was created using ${provider}. Please click "Continue with ${provider}" to sign in.`, 401);
  }

  if (!user || !(await user.comparePassword(validatedData.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status === "deactivated") {
    throw new AppError("Your account is currently deactivated. Please contact support to reactivate your access.", 403);
  }

  const token = await createSessionToken(req, user, validatedData.rememberMe);
  const expires = validatedData.rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined;

  res.cookie("token", token, { ...cookieOptions, expires, maxAge: validatedData.rememberMe ? cookieOptions.maxAge : undefined });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified, profilePic: user.profilePic, phone: user.phone, city: user.city }
  });
});

/**
 * @desc    Get current user
 */
export const getMe = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, data: req.user });
});

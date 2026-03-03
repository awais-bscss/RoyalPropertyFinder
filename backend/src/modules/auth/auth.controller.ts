import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";
import { generateToken } from "../../shared/utils/jwt";
// import * as AuthService from "./auth.service";

import User from "../user/user.model";
import { registerSchema, loginSchema } from "./auth.validation";

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
  // 1. Validate request body
  const validatedData = registerSchema.parse(req.body);

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email: validatedData.email });
  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  // 3. Create user
  const user = await User.create({
    name: validatedData.name,
    email: validatedData.email,
    phone: validatedData.phone,
    password: validatedData.password,
    authProvider: "email",
  });

  // 4. Generate token
  const token = generateToken({ id: user._id });

  // 5. Set cookie
  res.cookie("token", token, cookieOptions);

  // 6. Send response
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  });
});

/**
 * @desc    Login a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  console.log("Login attempt for:", req.body.email);
  // 1. Validate request body
  const validatedData = loginSchema.parse(req.body);

  // 2. Find user & include password
  const user = await User.findOne({ email: validatedData.email }).select("+password");

  // 2a. User exists but signed up via Google or Facebook (no password set)
  if (user && !user.password) {
    const provider = user.authProvider === "google" ? "Google" : user.authProvider === "facebook" ? "Facebook" : "social login";
    throw new AppError(
      `This account was created using ${provider}. Please click "Continue with ${provider}" to sign in.`,
      401
    );
  }

  // 2b. User not found or wrong password
  if (!user || !(await user.comparePassword(validatedData.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  // 3. Generate token
  const token = generateToken({ id: user._id });

  // 4. Set cookie based on rememberMe
  const expires = validatedData.rememberMe 
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    : undefined; // Session cookie (expires when browser closed)

  res.cookie("token", token, {
    ...cookieOptions,
    expires,
    maxAge: validatedData.rememberMe ? cookieOptions.maxAge : undefined
  });

  // 5. Send response
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
 * @access  Public
 */
export const googleOAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;

  if (!user) {
    throw new AppError("Authentication failed", 401);
  }

  // Generate a Stateless JWT to completely decouple from sessions post-login
  const token = generateToken({ id: user.id });

  // Send the token in an Http-Only cookie securely to the frontend
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // Redirect to the frontend after successful OAuth
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/`);
});

/**
 * @desc    Facebook OAuth Callback success handler
 * @route   GET /api/v1/auth/facebook/callback
 * @access  Public
 */
export const facebookOAuthCallback = catchAsync(async (req: Request, res: Response) => {
  const user: any = req.user;

  if (!user) {
    throw new AppError("Authentication failed", 401);
  }

  // Generate a Stateless JWT to completely decouple from sessions post-login
  const token = generateToken({ id: user.id });

  // Send the token in an Http-Only cookie securely to the frontend
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/`);
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
 * @desc    Logout user by clearing the httpOnly cookie
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = catchAsync(async (req: Request, res: Response) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), // expire in 10 seconds securely
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

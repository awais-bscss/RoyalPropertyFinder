import { z } from "zod";
import validator from "validator";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").refine((val) => validator.isEmail(val), {
    message: "Please enter a valid email address",
  }),
  phone: z.string().refine((val) => validator.isMobilePhone(val, "any", { strictMode: true }), {
    message: "Please enter a valid international mobile number (e.g., +923001234567)",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").refine((val) => validator.isEmail(val), {
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(8, "New password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

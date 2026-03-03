import { Request, Response, NextFunction } from "express";
import { AppError } from "../../shared/errors/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Zod Validation Error
  if (err.name === "ZodError" || err.issues) {
    statusCode = 400;
    message = err.issues
      ? err.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ")
      : "Invalid input data";
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const key = Object.keys(err.keyValue)[0];
    message = `${key.charAt(0).toUpperCase() + key.slice(1)} already exists`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((el: any) => el.message);
    message = `Invalid input data. ${errors.join(". ")}`;
  }

  // JSON Web Token Error
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again!";
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import session from "express-session";
import passport from "passport";

// Imports from the new architecture
import path from "path";
import apiRoutes from "./api/routes";
import { globalErrorHandler } from "./api/middlewares/error.middleware";
import "./config/passport"; // Initialize Passport strategies

const app: Express = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Express Session required for Passport OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_session_secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Serve uploaded property images publicly
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Primary API Version 1 Router
app.use("/api/v1", apiRoutes);

// 404 Handler for Unmatched Routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, `Can't find ${req.originalUrl} on this server`));
});

// Centralized Error Handling Middleware
app.use(globalErrorHandler);

export default app;

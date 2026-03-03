import { Router } from "express";
import passport from "passport";
import * as authController from "./auth.controller";
import { protect } from "../../api/middlewares/auth.middleware";

const router = Router();

router.post("/login", authController.login);

// --- Google OAuth Routes ---
// 1. Redirect user to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
  })
);

// 2. Google redirects here after successful approval
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false, // We use completely stateless JWTs post-login
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=auth_failed`,
  }),
  authController.googleOAuthCallback
);

// --- Facebook OAuth Routes ---
// 1. Redirect user to Facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

// 2. Facebook redirects here after successful approval
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=auth_failed`,
  }),
  authController.facebookOAuthCallback
);
// --- User Session Routes ---
router.get("/me", protect, authController.getMe);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
export default router;

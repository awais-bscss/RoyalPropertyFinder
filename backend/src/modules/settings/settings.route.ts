import express from "express";
import { getSettings, updateSettings } from "./settings.controller";
import { protect, restrictTo } from "../../api/middlewares/auth.middleware";

const router = express.Router();

/**
 * @desc Get Site Settings for Contact Page
 */
router.get("/", getSettings);

/**
 * @desc Update Site Settings (Admin Only)
 */
router.patch("/", protect, restrictTo("admin"), updateSettings);

export default router;

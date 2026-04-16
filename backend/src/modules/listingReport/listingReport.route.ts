import { Router } from "express";
import {
  createReport,
  getAllReports,
  updateReportStatus,
  deleteReport
} from "./listingReport.controller";
import { protect } from "../../api/middlewares/auth.middleware";
import { requireAdmin } from "../../api/middlewares/admin.middleware";

const router = Router();

// Routes for submitting reports
router.post("/:listingId", protect, createReport);

// Admin-only routes for managing reports
router.use(protect, requireAdmin);
router.get("/", getAllReports);
router.patch("/:id/status", updateReportStatus);
router.delete("/:id", deleteReport);

export default router;

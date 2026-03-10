import { Router } from "express";
import {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
  updateInquiryPriority,
  deleteInquiry,
  getInquiryStats,
  replyToInquiry,
} from "./inquiry.controller";
import { protect } from "../../api/middlewares/auth.middleware";
import { requireAdmin } from "../../api/middlewares/admin.middleware";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
/**
 * @route POST /api/v1/inquiries
 * Any user or visitor can send a support message
 */
router.post("/", createInquiry);

// ── Admin Only ────────────────────────────────────────────────────────────────
/**
 * All following routes are restricted to logged-in Admins
 */
router.use(protect, requireAdmin);

router.get("/stats", getInquiryStats);
router.get("/", getAllInquiries);
router.patch("/:id/status", updateInquiryStatus);
router.patch("/:id/priority", updateInquiryPriority);
router.post("/:id/reply", replyToInquiry);
router.delete("/:id", deleteInquiry);

export default router;

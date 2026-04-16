import { Router } from "express";
import {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  deleteListing,
  updateListing,
  adminGetAllListings,
  adminApproveListing,
  adminRejectListing,
  adminGetStats,
  adminToggleRoyalProject,
  getListingByShortId,
} from "./listing.controller";
import { protect, requireVerified } from "../../api/middlewares/auth.middleware";
import { requireAdmin } from "../../api/middlewares/admin.middleware";
import { upload } from "../../shared/utils/multer";

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/", getAllListings);

// ── Admin routes (must be BEFORE /:id to avoid conflicts) ───────────────────
router.get("/admin/stats", protect, requireAdmin, adminGetStats);
router.get("/admin/all", protect, requireAdmin, adminGetAllListings);
router.patch("/admin/:id/approve", protect, requireAdmin, adminApproveListing);
router.patch("/admin/:id/reject", protect, requireAdmin, adminRejectListing);
router.patch("/admin/:id/royal-project", protect, requireAdmin, adminToggleRoyalProject);

// ── Protected user routes ─────────────────────────────────────────────────────
router.use(protect);
router.get("/me/properties", getMyListings);
router.post("/", requireVerified, upload.fields([{ name: "images", maxCount: 20 }, { name: "videos", maxCount: 3 }]), createListing);
router.delete("/:id", deleteListing);
router.patch("/:id", requireVerified, upload.fields([{ name: "images", maxCount: 20 }, { name: "videos", maxCount: 3 }]), updateListing);



// ── Public single listing ─────────────────────────────────────────────────────
router.get("/search/:propertyId", getListingByShortId);
router.get("/:id", getListingById);

export default router;

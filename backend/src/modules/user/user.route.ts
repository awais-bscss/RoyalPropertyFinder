import { Router } from "express";
import {
  adminGetAllUsers,
  adminGetPlatformStats,
  adminUpdateUserRole,
  adminDeleteUser,
  updateProfile,
} from "./user.controller";
import { protect } from "../../api/middlewares/auth.middleware";
import { requireAdmin } from "../../api/middlewares/admin.middleware";
import { upload } from "../../shared/utils/multer";

const router = Router();

// Protected user routes
router.patch("/profile", protect, upload.single("profilePic"), updateProfile);

// All user admin routes require authentication + admin role
router.use(protect, requireAdmin);

router.get("/admin/all", adminGetAllUsers);
router.get("/admin/platform-stats", adminGetPlatformStats);
router.patch("/admin/:id/role", adminUpdateUserRole);
router.delete("/admin/:id", adminDeleteUser);

export default router;

import { Router } from "express";
import {
  adminGetAllUsers,
  adminGetPlatformStats,
  adminUpdateUserRole,
  adminDeleteUser,
} from "./user.controller";
import { protect } from "../../api/middlewares/auth.middleware";
import { requireAdmin } from "../../api/middlewares/admin.middleware";

const router = Router();

// All user admin routes require authentication + admin role
router.use(protect, requireAdmin);

router.get("/admin/all", adminGetAllUsers);
router.get("/admin/platform-stats", adminGetPlatformStats);
router.patch("/admin/:id/role", adminUpdateUserRole);
router.delete("/admin/:id", adminDeleteUser);

export default router;

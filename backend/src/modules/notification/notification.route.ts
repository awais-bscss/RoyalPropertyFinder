import { Router } from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "./notification.controller";
import { protect } from "../../api/middlewares/auth.middleware";

const router = Router();

// All notification routes require authentication
router.use(protect);

router.get("/", getMyNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/delete-all", deleteAllNotifications);
router.delete("/:id", deleteNotification);

export default router;

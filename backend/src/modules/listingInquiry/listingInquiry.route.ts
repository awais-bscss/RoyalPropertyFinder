import { Router } from "express";
import { protect, restrictTo } from "../../api/middlewares/auth.middleware";
import * as listingInquiryController from "./listingInquiry.controller";
import { uploadAttachment } from "../../shared/utils/inquiryMulter";

const router = Router();

// Route for buyers to send messages to seller
router.post("/:id/inquiry", listingInquiryController.createInquiry);

// Private routes for seller to manage inquiries
router.use(protect);
router.get("/inquiries/me", listingInquiryController.getMyInquiries);
router.patch("/inquiries/:inquiryId/read", listingInquiryController.markAsRead);
router.delete("/inquiries/:inquiryId", listingInquiryController.deleteInquiry);
router.post("/inquiries/:inquiryId/reply", uploadAttachment.array("attachments", 5), listingInquiryController.replyToPropertyInquiry);
router.delete("/inquiries/:inquiryId/replies/:replyId", listingInquiryController.deleteReply);

// Admin routes to manage ALL listings inquiries
router.get("/inquiries/all", protect, restrictTo("admin"), listingInquiryController.getAllListingInquiries);
// Status update for both Admin and Seller (Seller logic handled in controller)
router.patch("/inquiries/:inquiryId/status", protect, listingInquiryController.updateStatus);

export default router;

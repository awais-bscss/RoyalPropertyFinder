import { Router } from "express";
import { createListing, getAllListings, getListingById, getMyListings, deleteListing, updateListing } from "./listing.controller";
import { protect } from "../../api/middlewares/auth.middleware";
import { upload } from "../../shared/utils/multer";

const router = Router();

// Public routes
router.get("/", getAllListings);

// Protected routes (User must be logged in)
// IMPORTANT: /me/properties must be registered BEFORE /:id
// otherwise Express matches "me" as the :id parameter
router.use(protect);
router.get("/me/properties", getMyListings);
router.post("/", upload.array("images", 20), createListing);
router.delete("/:id", deleteListing);
router.patch("/:id", upload.array("images", 20), updateListing);

// Public single listing — registered AFTER /me/properties to avoid conflict
router.get("/:id", getListingById);

export default router;

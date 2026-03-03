import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";
import Listing from "./listing.model";
import { createListingSchema, updateListingSchema } from "./listing.validation";

// ── Helpers ────────────────────────────────────────────────────────────────────
/** Safely parse a JSON string or return the value as-is */
function tryParseJSON(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return value; }
}

/** Cast multipart text fields to the correct primitive types before Zod validation */
function coerceBody(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...body };

  // Numbers
  for (const key of ["areaSize", "price", "lat", "lng"]) {
    if (out[key] !== undefined && out[key] !== "") out[key] = Number(out[key]);
  }

  // Booleans
  for (const key of ["installment", "readyForPossession"]) {
    if (out[key] !== undefined) out[key] = out[key] === "true" || out[key] === true;
  }

  // Arrays (frontend sends JSON-stringified arrays in FormData)
  for (const key of ["selectedAmenities", "mobileNumbers", "videoLinks", "images"]) {
    out[key] = tryParseJSON(out[key]);
    if (!Array.isArray(out[key])) out[key] = out[key] ? [out[key]] : [];
  }

  return out;
}

/**
 * @desc    Create a new property listing (supports multipart/form-data for images)
 * @route   POST /api/v1/listings
 * @access  Private
 */
export const createListing = catchAsync(async (req: Request, res: Response) => {
  // 1. Ensure user is authenticated
  const user = (req as any).user;
  if (!user || !user._id) {
    throw new AppError("Not authorized to create listing", 401);
  }

  // 2. Build public URLs for uploaded images (multer puts files in req.files)
  const uploadedFiles = (req as any).files as Express.Multer.File[] | undefined;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const imageUrls: string[] = (uploadedFiles || []).map(
    (f) => `${baseUrl}/uploads/listings/${f.filename}`
  );

  // 3. Merge image URLs into body, then coerce types for Zod
  const rawBody = coerceBody({ ...req.body, images: imageUrls });

  // 4. Validate against Zod schema
  const validatedData = createListingSchema.parse(rawBody);

  // 5. Persist to DB
  const listing = await Listing.create({
    ...validatedData,
    user: user._id,
  });

  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    data: listing,
  });
});

/**
 * @desc    Get all active property listings
 * @route   GET /api/v1/listings
 * @access  Public
 */
export const getAllListings = catchAsync(async (req: Request, res: Response) => {
  const listings = await Listing.find({ isActive: true })
    .populate("user", "name email profilePic")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
});

/**
 * @desc    Get single listing by ID
 * @route   GET /api/v1/listings/:id
 * @access  Public
 */
export const getListingById = catchAsync(async (req: Request, res: Response) => {
  const listing = await Listing.findById(req.params.id).populate("user", "name email profilePic");

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  res.status(200).json({
    success: true,
    data: listing,
  });
});

/**
 * @desc    Get listings for the currently logged-in user
 * @route   GET /api/v1/listings/me/properties
 * @access  Private
 */
export const getMyListings = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user || !user._id) {
    throw new AppError("Not authorized", 401);
  }

  const listings = await Listing.find({ user: user._id }).sort("-createdAt");

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
});

/**
 * @desc    Delete a property listing (owner only)
 * @route   DELETE /api/v1/listings/:id
 * @access  Private
 */
export const deleteListing = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user || !user._id) {
    throw new AppError("Not authorized", 401);
  }

  // 1. Validate that an ID was actually provided in the URL
  const id = String(req.params.id); // narrow string | string[] → string
  if (!id || id.trim() === "") {
    throw new AppError("Listing ID is required", 400);
  }

  // 2. Validate it is a proper MongoDB ObjectId (24 hex chars)
  //    Without this, Mongoose throws an ugly CastError 500 for bad IDs
  const isValidObjectId = /^[a-fA-F0-9]{24}$/.test(id);
  if (!isValidObjectId) {
    throw new AppError("Invalid listing ID format", 400);
  }

  // 3. Find the listing
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  // 4. Ownership check — only the user who created it can delete it
  if (listing.user.toString() !== user._id.toString()) {
    throw new AppError("You are not authorized to delete this listing", 403);
  }

  // 5. Delete it
  await listing.deleteOne();

  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
    data: {},
  });
});

/**
 * @desc    Update a property listing (owner only — supports partial updates + new images)
 * @route   PATCH /api/v1/listings/:id
 * @access  Private
 */
export const updateListing = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user || !user._id) {
    throw new AppError("Not authorized", 401);
  }

  // 1. Validate ObjectId
  const id = String(req.params.id);
  if (!id || id.trim() === "") {
    throw new AppError("Listing ID is required", 400);
  }
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    throw new AppError("Invalid listing ID format", 400);
  }

  // 2. Find the listing
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new AppError("Listing not found", 404);
  }

  // 3. Ownership check
  if (listing.user.toString() !== user._id.toString()) {
    throw new AppError("You are not authorized to edit this listing", 403);
  }

  // 4. Handle newly-uploaded images (if any)
  //    New images are appended to the existing set; the client can also send
  //    a pruned `images` array in the body to remove old ones explicitly.
  const uploadedFiles = (req as any).files as Express.Multer.File[] | undefined;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const newImageUrls: string[] = (uploadedFiles || []).map(
    (f) => `${baseUrl}/uploads/listings/${f.filename}`
  );

  // 5. Coerce + merge body
  //    If the client sends an explicit `images` array we respect it;
  //    otherwise we keep the listing's existing images and append new uploads.
  const rawBody = coerceBody({ ...req.body });

  // Resolve the final images array:
  //  - Client sent an explicit list  → use that list + any new uploads
  //  - Client sent nothing           → keep existing images + any new uploads
  const existingImages = Array.isArray(rawBody.images)
    ? (rawBody.images as string[])
    : listing.images;
  const finalImages = [...existingImages, ...newImageUrls];
  rawBody.images = finalImages;

  // 6. Validate through the partial (all-optional) Zod schema
  const validatedData = updateListingSchema.parse(rawBody);

  // 7. Apply updates
  Object.assign(listing, validatedData);
  await listing.save();

  res.status(200).json({
    success: true,
    message: "Listing updated successfully",
    data: listing,
  });
});

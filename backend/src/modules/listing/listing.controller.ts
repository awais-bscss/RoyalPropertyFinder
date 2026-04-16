import { Request, Response } from "express";
import { catchAsync } from "../../shared/utils/catchAsync";
import { AppError } from "../../shared/errors/AppError";
import Listing from "./listing.model";
import { createListingSchema, updateListingSchema } from "./listing.validation";
import { uploadToCloudinary } from "../../shared/services/cloudinary.service";
import Notification, { NotificationType } from "../notification/notification.model";
import User from "../user/user.model";


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

  // 2. Handle file uploads to Cloudinary
  const files = (req.files as any) || {};
  const imageFiles = files.images as Express.Multer.File[] | undefined;
  const videoFiles = files.videos as Express.Multer.File[] | undefined;

  // Upload images concurrently
  const imageUrlPromises = (imageFiles || []).map(file => 
    uploadToCloudinary(file.path, "royal-property-finder/listings/images")
  );
  
  // Upload videos concurrently
  const videoUrlPromises = (videoFiles || []).map(file => 
    uploadToCloudinary(file.path, "royal-property-finder/listings/videos")
  );

  const [imageUrls, videoUrls] = await Promise.all([
    Promise.all(imageUrlPromises),
    Promise.all(videoUrlPromises)
  ]);

  // 3. Merge URLs into body, then coerce types for Zod
  // We combine any manually provided video Links (e.g. YouTube) with the new Cloudinary video uploads
  const bodyVideoLinks = tryParseJSON(req.body.videoLinks);
  const existingVideoLinks = Array.isArray(bodyVideoLinks) ? bodyVideoLinks : [];
  const finalVideoLinks = [...existingVideoLinks, ...videoUrls];

  const rawBody = coerceBody({ 
    ...req.body, 
    images: imageUrls,
    videoLinks: finalVideoLinks 
  });

  // 4. Validate against Zod schema
  const validatedData = createListingSchema.parse(rawBody);

  // 5. Persist to DB
  const listing = await Listing.create({
    ...validatedData,
    user: user._id,
    status: user.role === "admin" ? "approved" : "pending",
  });


  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    data: listing,
  });

  // 6. Notify Admins about the new pending listing
  try {
    const admins = await User.find({ role: "admin" }).select("_id");
    if (admins.length > 0) {
      const notificationData = admins.map(admin => ({
        recipient: admin._id,
        sender: user._id,
        type: NotificationType.LISTING_SUBMITTED,
        title: "New Listing Pending Approval",
        message: `${user.name} has submitted a new property listing: "${listing.title}".`,
        link: `/admin/dashboard?tab=listings&status=pending`,
      }));
      await Notification.insertMany(notificationData);
    }
  } catch (error) {
    console.error("Failed to send admin notification for new listing:", error);
  }
});


/**
 * @desc    Get all active property listings with comprehensive filtering
 * @route   GET /api/v1/listings
 * @access  Public
 */
export const getAllListings = catchAsync(async (req: Request, res: Response) => {
  const { 
    purpose, 
    city, 
    subtype, 
    propertyTypeTab, 
    minPrice, 
    maxPrice, 
    minArea, 
    maxArea, 
    bedrooms, 
    keyword,
    isRoyalProject 
  } = req.query;

  const filter: any = { isActive: true, status: "approved" };

  // Purpose (Sell/Rent)
  if (purpose && purpose !== "any") {
    // Purpose can be "Sell" or "Rent" in DB, but frontend might send "buy" or "rent"
    const p = purpose.toString().toLowerCase() === "buy" ? "Sell" : 
              purpose.toString().toLowerCase() === "rent" ? "Rent" : purpose;
    filter.purpose = p;
  }

  // City
  if (city && city !== "any") {
    filter.city = { $regex: new RegExp(`^${city}$`, "i") };
  }

  // Property Type Tab (HOMES -> home, PLOTS -> plot, COMMERCIAL -> commercial)
  if (propertyTypeTab && propertyTypeTab !== "any") {
    const tab = propertyTypeTab.toString().toLowerCase();
    const mappedTab = tab === "homes" ? "home" : 
                      tab === "plots" ? "plot" : 
                      tab === "commercial" ? "commercial" : tab;
    filter.propertyTypeTab = mappedTab;
  }

  // Subtype (House, Flat, etc)
  if (subtype && subtype !== "any") {
    filter.subtype = { $regex: new RegExp(`^${subtype}$`, "i") };
  }

  // Price Range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Area Range
  if (minArea || maxArea) {
    filter.areaSize = {};
    if (minArea) filter.areaSize.$gte = Number(minArea);
    if (maxArea) filter.areaSize.$lte = Number(maxArea);
  }

  // Bedrooms
  if (bedrooms && bedrooms !== "All") {
    filter.bedrooms = bedrooms;
  }

  // Royal Project
  if (isRoyalProject === "true") {
    filter.isRoyalProject = true;
  }

  // Keyword Search (Title, Description, Location, propertyId)
  if (keyword) {
    const kw = keyword.toString().trim();
    const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { title: regex },
      { description: regex },
      { location: regex },
      { city: regex },
      { propertyId: regex },
      { subtype: regex }
    ];
  }

  const listings = await Listing.find(filter)
    .populate("user", "name email profilePic")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
});

/**
 * @desc    Admin: Get ALL listings for approval management (any status)
 * @route   GET /api/v1/listings/admin/all
 * @access  Admin only
 */
export const adminGetAllListings = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.query;
  const filter: Record<string, unknown> = {};
  if (status && status !== "all") filter.status = status;

  const listings = await Listing.find(filter)
    .populate("user", "name email profilePic phone")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings,
  });
});

/**
 * @desc    Admin: Get dashboard stats
 * @route   GET /api/v1/listings/admin/stats
 * @access  Admin only
 */
export const adminGetStats = catchAsync(async (req: Request, res: Response) => {
  const [total, pending, approved, rejected] = await Promise.all([
    Listing.countDocuments(),
    Listing.countDocuments({ status: "pending" }),
    Listing.countDocuments({ status: "approved" }),
    Listing.countDocuments({ status: "rejected" }),
  ]);

  res.status(200).json({
    success: true,
    data: { total, pending, approved, rejected },
  });
});

/**
 * @desc    Admin: Approve a listing
 * @route   PATCH /api/v1/listings/admin/:id/approve
 * @access  Admin only
 */
export const adminApproveListing = catchAsync(async (req: Request, res: Response) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError("Listing not found", 404);

  listing.status = "approved";
  listing.rejectionReason = undefined;
  await listing.save();

  res.status(200).json({
    success: true,
    message: "Listing approved successfully",
    data: listing,
  });

  // 2. Notify the property owner
  try {
    const admin = (req as any).user;
    await Notification.create({
      recipient: listing.user,
      sender: admin._id,
      type: NotificationType.LISTING_APPROVED,
      title: "Listing Approved!",
      message: `Your property listing "${listing.title}" has been approved and is now live.`,
      link: `/dashboard/my-properties`,
    });
  } catch (error) {
    console.error("Failed to send notification for listing approval:", error);
  }
});

/**
 * @desc    Admin: Reject a listing
 * @route   PATCH /api/v1/listings/admin/:id/reject
 * @access  Admin only
 */
export const adminRejectListing = catchAsync(async (req: Request, res: Response) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError("Listing not found", 404);

  listing.status = "rejected";
  listing.rejectionReason = req.body.reason || "Did not meet listing standards.";
  await listing.save();

  res.status(200).json({
    success: true,
    message: "Listing rejected",
    data: listing,
  });

  // 2. Notify the property owner
  try {
    const admin = (req as any).user;
    await Notification.create({
      recipient: listing.user,
      sender: admin._id,
      type: NotificationType.LISTING_REJECTED,
      title: "Listing Rejected",
      message: `Your property listing "${listing.title}" was rejected. Reason: ${listing.rejectionReason}`,
      link: `/dashboard/my-properties`,
    });
  } catch (error) {
    console.error("Failed to send notification for listing rejection:", error);
  }
});

/**
 * @desc    Admin: Toggle a listing as a Royal Project / New Project
 * @route   PATCH /api/v1/listings/admin/:id/royal-project
 * @access  Admin only
 */
export const adminToggleRoyalProject = catchAsync(async (req: Request, res: Response) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError("Listing not found", 404);

  listing.isRoyalProject = !listing.isRoyalProject;
  await listing.save();

  res.status(200).json({
    success: true,
    message: `Listing is ${listing.isRoyalProject ? "now" : "no longer"} a Royal Project`,
    data: listing,
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
 * @desc    Find a listing by its short, human-readable ID (e.g., RP-1001)
 * @route   GET /api/v1/listings/search/:propertyId
 * @access  Public
 */
export const getListingByShortId = catchAsync(async (req: Request, res: Response) => {
  let cleanId = (req.params.propertyId || "").toString();
  
  // Clean the ID (strip # if user pasted it)
  cleanId = cleanId.trim();
  if (cleanId.startsWith("#")) {
    cleanId = cleanId.substring(1);
  }
  cleanId = cleanId.trim();
  
  // Use a case-insensitive find
  const listing = await Listing.findOne({ 
    propertyId: { $regex: new RegExp(`^${cleanId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } 
  });
  
  if (!listing) {
    throw new AppError("No property found with that ID", 404);
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

  // 4. Ownership check — only the user who created it or an Admin can delete it
  if (user.role !== "admin" && listing.user.toString() !== user._id.toString()) {
    throw new AppError("You are not authorized to delete this listing", 403);
  }

  const ownerId = listing.user;
  const listingTitle = listing.title;

  // 5. Delete it
  await listing.deleteOne();

  res.status(200).json({
    success: true,
    message: "Listing deleted successfully",
    data: {},
  });

  // 6. Notify owner IF deleted by Admin
  if (user.role === "admin") {
    try {
      await Notification.create({
        recipient: ownerId,
        sender: user._id,
        type: NotificationType.LISTING_REJECTED, // Use REJECTED as it represents the same 'gone' status
        title: "Listing Removed by Admin",
        message: `Your listing "${listingTitle}" has been removed by the administration for violating platform policies.`,
        link: `/dashboard/my-properties`,
      });
    } catch (error) {
      console.error("Failed to notify owner of administrative deletion:", error);
    }
  }
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

  // 4. Handle newly-uploaded images and videos to Cloudinary
  const files = (req.files as any) || {};
  const imageFiles = files.images as Express.Multer.File[] | undefined;
  const videoFiles = files.videos as Express.Multer.File[] | undefined;

  // Upload concurrently
  const imagePromises = (imageFiles || []).map(file => 
    uploadToCloudinary(file.path, "royal-property-finder/listings/images")
  );
  const videoPromises = (videoFiles || []).map(file => 
    uploadToCloudinary(file.path, "royal-property-finder/listings/videos")
  );

  const [newImageUrls, newVideoUrls] = await Promise.all([
    Promise.all(imagePromises),
    Promise.all(videoPromises)
  ]);

  // 5. Coerce + merge body
  const rawBody = coerceBody({ ...req.body });

  // Resolve final images array
  const existingImages = Array.isArray(rawBody.images)
    ? (rawBody.images as string[])
    : listing.images;
  rawBody.images = [...existingImages, ...newImageUrls];

  // Resolve final videoLinks array
  const existingVideoLinks = Array.isArray(rawBody.videoLinks)
    ? (rawBody.videoLinks as string[])
    : listing.videoLinks;
  rawBody.videoLinks = [...existingVideoLinks, ...newVideoUrls];

  // 6. Validate through the partial Zod schema
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


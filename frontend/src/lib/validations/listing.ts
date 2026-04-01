import { z } from "zod";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"];

export const listingSchema = z.object({
  purpose: z.enum(["Sell", "Rent"]),
  propertyTypeTab: z.string().min(1, "Property type is required"),
  subtype: z.string().min(1, "Subtype is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().optional().nullable(),
  location: z.string().min(1, "Location is required"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  areaSize: z.coerce.number().positive("Area must be a positive number"),
  areaUnit: z.string().min(1, "Area unit is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  currency: z.string().default("PKR"),
  installment: z.boolean().default(false),
  readyForPossession: z.boolean().default(false),
  bedrooms: z.string().optional().nullable(),
  bathrooms: z.string().optional().nullable(),
  selectedAmenities: z.array(z.string()).default([]),
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be less than 150 characters"),
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(3000, "Description is too long"),
  contactEmail: z.string().email("Please enter a valid email address"),
  mobileNumbers: z.array(z.string()).min(1, "At least one mobile number is required"),
  landline: z.string().optional().nullable(),
  
  // Custom validations for local state (images & videos)
  images: z.any()
    .refine((files: any[]) => files?.length > 0, "At least one image is required")
    .refine((files: any[]) => files?.length <= 20, "You can upload a maximum of 20 images")
    .refine((files: any[]) => {
      if (!files || files.length === 0) return true;
      return files.every(file => {
        if (typeof file === 'string') return true; // Existing URLs
        return file.size <= MAX_FILE_SIZE;
      });
    }, "Each image must be less than 50MB")
    .refine((files: any[]) => {
      if (!files || files.length === 0) return true;
      return files.every(file => {
        if (typeof file === 'string') return true; // Existing URLs
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      });
    }, "Only .jpg, .jpeg, .png and .webp formats are supported for images"),

  // For locally uploaded video files (if any) or links
  videoLinks: z.array(z.string()).max(3, "Maximum 3 video links/files allowed")
});

export type ListingFormData = z.infer<typeof listingSchema>;

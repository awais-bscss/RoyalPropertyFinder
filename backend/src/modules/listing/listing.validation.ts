import { z } from "zod";

export const createListingSchema = z.object({
  purpose: z.enum(["Sell", "Rent"]),
  propertyTypeTab: z.string().min(1, "Property type is required"),
  subtype: z.string().min(1, "Subtype is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().optional().nullable(),
  location: z.string().min(1, "Location is required"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  areaSize: z.number().positive("Area must be positive"),
  areaUnit: z.string().min(1, "Area unit is required"),
  price: z.number().positive("Price must be positive"),
  currency: z.string().default("PKR"),
  installment: z.boolean().default(false),
  readyForPossession: z.boolean().default(false),
  bedrooms: z.string().optional().nullable(),
  bathrooms: z.string().optional().nullable(),
  selectedAmenities: z.array(z.string()).default([]),
  title: z.string().min(5, "Title is too short").max(150, "Title is too long"),
  description: z.string().min(20, "Description is too short").max(3000, "Description is too long"),
  images: z.array(z.string()).default([]),
  videoLinks: z.array(z.string()).default([]),
  contactEmail: z.string().email("Invalid email address"),
  mobileNumbers: z.array(z.string()).min(1, "At least one mobile number is required"),
  landline: z.string().optional().nullable(),
});

/**
 * For PATCH /listings/:id — every field is optional so the client
 * only needs to send the fields it actually wants to update.
 */
export const updateListingSchema = createListingSchema.partial();


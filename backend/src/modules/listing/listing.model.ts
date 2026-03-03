import mongoose, { Document, Schema } from "mongoose";

export interface IListing extends Document {
  user: mongoose.Types.ObjectId;
  purpose: "Sell" | "Rent";
  propertyTypeTab: string; // e.g., 'home', 'plot', 'commercial'
  subtype: string; // e.g., 'House', 'Flat', 'Residential Plot'
  city: string;
  province: string;
  location: string;
  lat: number;
  lng: number;
  areaSize: number;
  areaUnit: string;
  price: number;
  currency: string;
  installment: boolean;
  readyForPossession: boolean;
  bedrooms?: string; // string because it can be "10+"
  bathrooms?: string;
  selectedAmenities: string[];
  title: string;
  description: string;
  images: string[];
  videoLinks: string[];
  contactEmail: string;
  mobileNumbers: string[];
  landline?: string;
  isActive: boolean;
}

const listingSchema = new Schema<IListing>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    purpose: { type: String, required: true, enum: ["Sell", "Rent"] },
    propertyTypeTab: { type: String, required: true },
    subtype: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    location: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    areaSize: { type: Number, required: true },
    areaUnit: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "PKR" },
    installment: { type: Boolean, default: false },
    readyForPossession: { type: Boolean, default: false },
    bedrooms: { type: String },
    bathrooms: { type: String },
    selectedAmenities: [{ type: String }],
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    videoLinks: [{ type: String }],
    contactEmail: { type: String, required: true },
    mobileNumbers: [{ type: String }],
    landline: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Listing = mongoose.model<IListing>("Listing", listingSchema);
export default Listing;

// ─── Post-Listing Feature Types ──────────────────────────────────────────────

export interface PropertyType {
  id: string;
  label: string;
  icon: React.ElementType;
  subtypes: string[];
}

export interface PostListingFormState {
  // Section 1 – Location & Purpose
  purpose: string;
  propertyTypeTab: string;
  subtype: string;
  city: string;
  province: string;
  location: string;

  // Section 2 – Price & Area
  areaSize: string;
  areaUnit: string;
  price: string;
  currency: string;
  installment: boolean;
  readyForPossession: boolean;

  // Section 3 – Features & Amenities
  bedrooms: string;
  bathrooms: string;
  selectedAmenities: string[];
  showAmenitiesModal: boolean;

  // Section 4 – Ad Information
  title: string;
  description: string;

  // Section 5 – Images & Videos
  images: File[];
  coverIdx: number;
  videoLinks: string[];
  videoInput: string;

  // Section 6 – Contact
  contactEmail: string;
  mobileNumbers: string[];
  landline: string;

  // Section 7 – Platform
  platformRPF: boolean;
}

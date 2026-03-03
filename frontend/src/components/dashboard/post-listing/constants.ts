import { Home, MapPin, Building2 } from "lucide-react";
import type { PropertyType } from "@/components/dashboard/post-listing/types";

export const PURPOSES = ["Sell", "Rent"] as const;

export const PROPERTY_TYPES: PropertyType[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    subtypes: ["House", "Flat", "Upper Portion", "Lower Portion", "Farm House", "Room", "Penthouse"],
  },
  {
    id: "plots",
    label: "Plots",
    icon: MapPin,
    subtypes: ["Residential Plot", "Commercial Plot", "Plot File", "Plot Boundary", "Agriculture Land", "Industrial Land"],
  },
  {
    id: "commercial",
    label: "Commercial",
    icon: Building2,
    subtypes: ["Office", "Shop", "Warehouse", "Factory", "Building", "Other"],
  },
];

export const AREA_UNITS = ["Sq. Ft.", "Sq. Yd.", "Sq. M.", "Kanal", "Marla"] as const;

export const CURRENCIES = ["PKR", "USD", "AED"] as const;

export const BEDROOMS = ["Studio", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "10+"] as const;

export const BATHROOMS = ["1", "2", "3", "4", "5", "6", "6+"] as const;

export const AMENITIES_OPTIONS = [
  "Parking Space",
  "Generator",
  "CCTV",
  "Security Guard",
  "Elevator / Lift",
  "Internet / Broadband",
  "Gas (Sui Gas)",
  "Electricity (WAPDA / KESC)",
  "Water Supply",
  "Central Air Conditioning",
  "Waste Disposal",
  "Servant Quarters",
  "Swimming Pool",
  "Gymnasium",
  "Mosque / Prayer Area",
  "Community Garden",
  "Kids Play Area",
  "Maintenance Staff",
  "Intercom",
  "Solar Panels",
] as const;

export const LOCATION_OPTIONS = [
  "DHA Phase 1", "DHA Phase 5", "Gulberg", "Bahria Town",
  "F-10", "G-11", "Johar Town", "Model Town", "Clifton", "North Nazimabad",
] as const;

import { Home, MapPin, Building2 } from "lucide-react";

export const browsePropertiesData = [
  {
    title: "Homes",
    icon: Home,
    color: "#023E8A",
    tabs: [
      { id: "popular", label: "Popular" },
      { id: "type", label: "Type" },
      { id: "area", label: "Area Size" },
    ],
    items: {
      popular: [
        { label: "Houses", sub: "Karachi" },
        { label: "Apartments", sub: "Karachi" },
        { label: "Houses", sub: "Lahore" },
        { label: "Apartments", sub: "Lahore" },
        { label: "Houses", sub: "Islamabad" },
        { label: "Apartments", sub: "Islamabad" },
      ],
      type: [
        { label: "Houses", sub: "Homes" },
        { label: "Flats", sub: "Homes" },
        { label: "Upper Portions", sub: "Homes" },
        { label: "Lower Portions", sub: "Homes" },
        { label: "Farm Houses", sub: "Homes" },
        { label: "Rooms", sub: "Homes" },
      ],
      area: [
        { label: "120 - 125 sq yard", sub: "Homes" },
        { label: "500 sq yd", sub: "Homes" },
        { label: "80 sq yd", sub: "Homes" },
        { label: "240-250 sq yd", sub: "Homes" },
        { label: "300 sq yd", sub: "Homes" },
        { label: "50-60 sq yard", sub: "Homes" },
      ],
    },
  },
  {
    title: "Plots",
    icon: MapPin,
    color: "#023E8A",
    tabs: [
      { id: "popular", label: "Popular" },
      { id: "type", label: "Type" },
      { id: "area", label: "Area Size" },
    ],
    items: {
      popular: [
        { label: "Residential Plots", sub: "Karachi" },
        { label: "Commercial Plots", sub: "Karachi" },
        { label: "Residential Plots", sub: "Lahore" },
        { label: "Commercial Plots", sub: "Lahore" },
        { label: "Residential Plots", sub: "Islamabad" },
        { label: "Commercial Plots", sub: "Islamabad" },
      ],
      type: [
        { label: "Residential Plots", sub: "Plots" },
        { label: "Commercial Plots", sub: "Plots" },
        { label: "Plot Files", sub: "Plots" },
        { label: "Plot Boundaries", sub: "Plots" },
        { label: "Agriculture Land", sub: "Plots" },
        { label: "Industrial Land", sub: "Plots" },
      ],
      area: [
        { label: "125 sq yd", sub: "Plots" },
        { label: "250 sq yd", sub: "Plots" },
        { label: "500 sq yd", sub: "Plots" },
        { label: "1000 sq yd", sub: "Plots" },
        { label: "5 Marla", sub: "Plots" },
        { label: "10 Marla", sub: "Plots" },
      ],
    },
  },
  {
    title: "Commercial",
    icon: Building2,
    color: "#023E8A",
    tabs: [
      { id: "popular", label: "Popular" },
      { id: "type", label: "Type" },
      { id: "area", label: "Area Size" },
    ],
    items: {
      popular: [
        { label: "Offices", sub: "Karachi" },
        { label: "Shops", sub: "Karachi" },
        { label: "Offices", sub: "Lahore" },
        { label: "Shops", sub: "Lahore" },
        { label: "Offices", sub: "Islamabad" },
        { label: "Shops", sub: "Islamabad" },
      ],
      type: [
        { label: "Offices", sub: "Commercial" },
        { label: "Shops", sub: "Commercial" },
        { label: "Warehouses", sub: "Commercial" },
        { label: "Factories", sub: "Commercial" },
        { label: "Buildings", sub: "Commercial" },
        { label: "Other", sub: "Commercial" },
      ],
      area: [
        { label: "Less than 100 sq ft", sub: "Commercial" },
        { label: "100-200 sq ft", sub: "Commercial" },
        { label: "200-300 sq ft", sub: "Commercial" },
        { label: "300-400 sq ft", sub: "Commercial" },
        { label: "More than 500 s...", sub: "Commercial" },
        { label: "1000 sq ft", sub: "Commercial" },
      ],
    },
  },
];

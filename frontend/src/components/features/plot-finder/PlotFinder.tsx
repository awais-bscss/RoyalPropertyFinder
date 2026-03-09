"use client";

import dynamic from "next/dynamic";
import { ArrowLeft, Map as MapIcon, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CitySearchDropdown } from "@/components/ui/CitySearchDropdown";
import { SocietySearchDropdown } from "@/components/features/plot-finder/SocietySearchDropdown";

// Must require manually due to commonjs format
const pakistaniCities = require("pakistani-cities-api") as {
  getAllCities: () => Array<{ name: string; lat: string; lng: string }>;
};

// Dynamically import the map to avoid SSR issues with Leaflet
const FullScreenMap = dynamic<{
  center?: { lat: number; lng: number; zoom: number } | null;
  selectedCity?: string;
}>(() => import("@/components/features/plot-finder/FullScreenMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <MapIcon className="w-12 h-12 text-royal-600 animate-pulse" />
        <p className="text-slate-500 font-medium">Loading Pakistan Map...</p>
      </div>
    </div>
  ),
});

export function PlotFinder() {
  const [mounted, setMounted] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
    zoom: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    if (!cityName) return;

    // Find city coordinates
    const cityData = pakistaniCities
      .getAllCities()
      .find((c) => c.name === cityName);
    if (cityData && cityData.lat && cityData.lng) {
      setMapCenter({
        lat: parseFloat(cityData.lat),
        lng: parseFloat(cityData.lng),
        zoom: 12, // Zoom in closer for a specific city
      });
      // Close the sidebar after setting the city
      setIsSidebarOpen(false);
    }
  };

  const handleSocietySelect = (society: { lat: number; lng: number }) => {
    // Zoom in very close to the selected society
    setMapCenter({
      lat: society.lat,
      lng: society.lng,
      zoom: 16, // tighter zoom for a society level
    });
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-full relative overflow-hidden bg-slate-100">
      {/* Top Left Menu Button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 text-slate-800 dark:text-white px-4 py-2.5 rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-white transition-colors cursor-pointer w-fit"
        >
          <Menu className="w-4 h-4" />
          <span className="font-semibold text-[14px]">Search a City</span>
        </button>
      </div>

      {/* Center Search Bar Overlay (Only visible if city is selected) */}
      {selectedCity && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-md px-4">
          <SocietySearchDropdown
            selectedCity={selectedCity}
            onSelect={handleSocietySelect}
          />
        </div>
      )}

      {/* Sliding Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 dark:text-white text-[15px] flex items-center gap-2">
            <Search className="w-4 h-4 text-royal-600" />
            Jump to City
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 flex-1">
          <CitySearchDropdown
            value={selectedCity}
            onChange={handleCitySelect}
            placeholder="Search over 100+ cities..."
          />
        </div>

        {/* Home Button inside the sidebar for navigation */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl transition-colors cursor-pointer font-semibold text-[14px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Optional: Clickable overlay to close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/20 backdrop-blur-[1px] transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Interactive Map */}
      <div className="h-full w-full z-0">
        <FullScreenMap center={mapCenter} selectedCity={selectedCity} />
      </div>
    </main>
  );
}

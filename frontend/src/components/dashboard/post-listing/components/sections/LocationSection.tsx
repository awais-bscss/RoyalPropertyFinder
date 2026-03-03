"use client";

import { useEffect, useState } from "react";
import {
  Home,
  MapPin,
  Search,
  X,
  Tag,
  KeyRound,
  LayoutGrid,
} from "lucide-react";
import dynamic from "next/dynamic";
import { CitySearchDropdown } from "@/components/ui/CitySearchDropdown";
import { LocationSearchDropdown } from "@/components/ui/LocationSearchDropdown";

const LocationMap = dynamic(() => import("../LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-full w-full bg-slate-100 dark:bg-slate-800 text-slate-400">
      Loading map configuration...
    </div>
  ),
});
import {
  SectionHeader,
  SectionCard,
  FieldLabel,
  PillButton,
} from "@/components/dashboard/post-listing/components/ui";
import {
  PURPOSES,
  PROPERTY_TYPES,
} from "@/components/dashboard/post-listing/constants";

interface Props {
  purpose: string;
  setPurpose: (v: string) => void;
  propertyTypeTab: string;
  setPropertyTypeTab: (v: string) => void;
  subtype: string;
  setSubtype: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  province: string;
  setProvince: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  lat: number;
  setLat: (v: number) => void;
  lng: number;
  setLng: (v: number) => void;
}

export function LocationSection({
  purpose,
  setPurpose,
  propertyTypeTab,
  setPropertyTypeTab,
  subtype,
  setSubtype,
  city,
  setCity,
  province,
  setProvince,
  location,
  setLocation,
  lat,
  setLat,
  lng,
  setLng,
}: Props) {
  const activeType = PROPERTY_TYPES.find((t) => t.id === propertyTypeTab);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Auto-geocode when city or location text changes
  useEffect(() => {
    if (!city || !location) return;

    // Debounce to prevent spamming the geocoding API
    const timer = setTimeout(async () => {
      setIsGeocoding(true);
      try {
        const query = encodeURIComponent(`${location}, ${city}, Pakistan`);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
        );
        const data = await res.json();

        if (data && data.length > 0) {
          // If a result is found, update the physical map coordinates
          setLat(parseFloat(data[0].lat));
          setLng(parseFloat(data[0].lon));
        }
      } catch (error) {
        console.error("Geocoding failed:", error);
      } finally {
        setIsGeocoding(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [city, location, setLat, setLng]);

  return (
    <SectionCard>
      <SectionHeader
        step={1}
        label="Location and Purpose"
        icon={<MapPin className="w-6 h-6" />}
      />

      {/* Purpose */}
      <div className="mb-6">
        <FieldLabel>
          <Tag className="w-4 h-4 text-royal-600" /> Select Purpose
        </FieldLabel>
        <div className="flex gap-3">
          {PURPOSES.map((p) => {
            const Icon = p === "Sell" ? Tag : KeyRound;
            return (
              <PillButton
                key={p}
                active={purpose === p}
                onClick={() => setPurpose(p)}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" /> {p}
                </span>
              </PillButton>
            );
          })}
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <FieldLabel>
          <LayoutGrid className="w-4 h-4 text-royal-600" /> Select Property Type
        </FieldLabel>
        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 mb-5">
          {PROPERTY_TYPES.map((t) => {
            const TabIcon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setPropertyTypeTab(t.id);
                  setSubtype(t.subtypes[0]);
                }}
                className={`flex items-center gap-1.5 px-5 py-2.5 text-[15px] font-semibold transition-all cursor-pointer border-b-2 -mb-px ${
                  propertyTypeTab === t.id
                    ? "border-royal-700 text-royal-700 dark:text-royal-400"
                    : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {activeType?.subtypes.map((s) => (
            <PillButton
              key={s}
              active={subtype === s}
              onClick={() => setSubtype(s)}
            >
              {s}
            </PillButton>
          ))}
        </div>
      </div>

      {/* City */}
      <div className="mb-6">
        <FieldLabel>
          <MapPin className="w-5 h-5 text-royal-600" /> City
        </FieldLabel>
        <CitySearchDropdown
          value={city}
          onChange={(cityName, prov) => {
            setCity(cityName);
            setProvince(prov);
          }}
          placeholder="Search Pakistani city..."
        />
        {province && (
          <p className="text-[13px] text-slate-400 mt-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Province:{" "}
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {province}
            </span>
          </p>
        )}
      </div>

      {/* Location / Society */}
      <div>
        <FieldLabel>
          <MapPin className="w-5 h-5 text-royal-600" /> Location / Society
        </FieldLabel>
        <LocationSearchDropdown
          city={city}
          value={location}
          onChange={setLocation}
          disabled={!city}
        />

        {/* Helper info text for geocoding */}
        {isGeocoding && (
          <p className="mt-2 text-[12px] flex items-center gap-1.5 text-royal-600 dark:text-royal-400 font-medium">
            <Search className="w-3.5 h-3.5 animate-pulse" /> Locating on Map...
          </p>
        )}

        {/* Action Button */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[13px] text-slate-500 font-medium">
            Pin drop location
          </p>
          <button
            type="button"
            onClick={() => setIsMapOpen(true)}
            disabled={!city || !location}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[13px] font-bold transition-all shadow-sm ${
              !city || !location
                ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed opacity-70"
                : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-royal-700 dark:text-royal-400 hover:shadow hover:bg-slate-50 cursor-pointer"
            }`}
          >
            <MapPin className="w-4 h-4" />
            {!city || !location ? "Set Location on Map" : "Expand Map"}
          </button>
        </div>

        {/* Inline Map Viewer */}
        <div className="mt-3 h-[250px] flex items-center justify-center rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 relative shadow-inner z-0">
          {city && location ? (
            <div className="w-full h-full pointer-events-none opacity-80 mix-blend-multiply dark:mix-blend-screen grayscale-30">
              {/* Note: In a real app this might be a static map image for performance, but we'll use Leaflet here locked in visually */}
              <LocationMap lat={lat} lng={lng} onChange={() => {}} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <MapPin className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-[13px] font-semibold">Map will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-slate-200 dark:border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  Pinpoint Location
                </h3>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  Drag the marker to perfectly match your property's exact
                  location in {location}, {city}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Map Canvas */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-800 relative shadow-inner z-0">
              <LocationMap
                lat={lat}
                lng={lng}
                onChange={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }}
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className="px-6 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-[14px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className="px-6 py-2.5 rounded-sm bg-royal-600 hover:bg-royal-700 text-white font-semibold shadow-sm hover:shadow transition-all cursor-pointer text-[14px] flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Save Fixed Location
              </button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

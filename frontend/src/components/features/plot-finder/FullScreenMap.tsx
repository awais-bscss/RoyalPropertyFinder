"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Tooltip,
} from "react-leaflet";
import { Layers, Plus, Minus } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Basic icon fix for Leaflet
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

// Mock societies in Pakistan
export const societies = [
  {
    name: "DHA Phase 6",
    city: "Lahore",
    lat: 31.458,
    lng: 74.4514,
    plots: 145,
  },
  {
    name: "Bahria Town",
    city: "Lahore",
    lat: 31.3644,
    lng: 74.1924,
    plots: 312,
  },
  { name: "Lake City", city: "Lahore", lat: 31.3411, lng: 74.2269, plots: 89 },
  {
    name: "DHA Phase 2",
    city: "Islamabad",
    lat: 33.528,
    lng: 73.0906,
    plots: 205,
  },
  {
    name: "Bahria Enclave",
    city: "Islamabad",
    lat: 33.7145,
    lng: 73.2389,
    plots: 178,
  },
  {
    name: "Gulberg Greens",
    city: "Islamabad",
    lat: 33.6234,
    lng: 73.1678,
    plots: 94,
  },
  {
    name: "Clifton Block 5",
    city: "Karachi",
    lat: 24.8198,
    lng: 67.0142,
    plots: 42,
  },
  { name: "DHA City", city: "Karachi", lat: 25.0185, lng: 67.4334, plots: 450 },
  {
    name: "DHA Phase 1",
    city: "Gujranwala",
    lat: 32.2285,
    lng: 74.1481,
    plots: 120,
  },
  {
    name: "Citi Housing",
    city: "Faisalabad",
    lat: 31.4815,
    lng: 73.1234,
    plots: 210,
  },
];

// Component to update the map view dynamically
function MapUpdater({
  center,
}: {
  center: { lat: number; lng: number; zoom: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lng], center.zoom, {
        animate: true,
        duration: 2, // Smooth 2s fly animation
      });
    }
  }, [center, map]);

  return null;
}

export default function FullScreenMap({
  center,
  selectedCity,
}: {
  center?: { lat: number; lng: number; zoom: number } | null;
  selectedCity?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [mapType, setMapType] = useState<"street" | "satellite">("street");
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fix Leaflet icons
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });
  }, []);

  if (!mounted) return null;

  // Center on Pakistan broadly
  const pakistanCenter: [number, number] = [30.3753, 69.3451];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={pakistanCenter}
        zoom={6}
        ref={setMapRef}
        scrollWheelZoom={true}
        zoomControl={false} // Disable default top-left control
        className="h-full w-full z-0 leaflet-container-fullscreen"
        style={{ height: "100vh", width: "100vw", zIndex: 0 }}
      >
        {mapType === "street" ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        ) : (
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Dynamic Updater */}
        <MapUpdater center={center || null} />

        {/* Render map pins for major societies */}
        {societies.map((society, idx) => (
          <Marker
            key={idx}
            position={[society.lat, society.lng]}
            icon={
              new L.Icon({
                iconUrl,
                iconRetinaUrl,
                shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [0, -35], // 0 horizontal centers it over the pin, -35 pushes it up to the tip
                shadowSize: [41, 41],
              })
            }
          >
            {selectedCity && society.city === selectedCity && (
              <Tooltip
                permanent
                direction="top"
                className="bg-white/90 backdrop-blur border-none shadow-md font-bold text-[13px] text-royal-800 rounded py-1 px-2.5"
              >
                {society.name}, {society.city}
              </Tooltip>
            )}
            <Popup className="royal-popup">
              <div className="p-1">
                <h3 className="font-bold text-[15px] text-royal-800">
                  {society.name}
                </h3>
                <p className="text-[13px] text-slate-500 mb-2">
                  {society.city}
                </p>
                <div className="bg-royal-50 border border-royal-100 rounded-md px-3 py-1.5 inline-block">
                  <span className="font-bold text-royal-700">
                    {society.plots}
                  </span>
                  <span className="text-[12px] text-royal-600 ml-1">
                    Plots available
                  </span>
                </div>
                <button className="w-full mt-3 bg-royal-700 hover:bg-royal-800 text-white rounded text-[13px] font-bold py-1.5 transition-colors cursor-pointer">
                  View Society Map
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Custom Right-Side Controls rendered OUTSIDE MapContainer to avoid Leaflet layer crash */}
      <div
        className="absolute bottom-10 right-6 flex flex-col items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden pointer-events-auto"
        style={{ zIndex: 1000 }}
      >
        {/* Zoom In */}
        <button
          type="button"
          onClick={() => mapRef?.zoomIn()}
          className="w-11 h-11 flex justify-center items-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-5 h-5 cursor-pointer" />
        </button>

        {/* Map Type Toggle */}
        <button
          type="button"
          onClick={() =>
            setMapType(mapType === "street" ? "satellite" : "street")
          }
          className={`w-11 h-11 flex justify-center items-center transition-colors border-b border-slate-100 dark:border-slate-800 cursor-pointer ${
            mapType === "satellite"
              ? "bg-royal-50 dark:bg-royal-900/40 text-royal-700 dark:text-royal-400"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
          title={
            mapType === "street" ? "Switch to Satellite" : "Switch to Street"
          }
        >
          <Layers className="w-5 h-5 cursor-pointer" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => mapRef?.zoomOut()}
          className="w-11 h-11 flex justify-center items-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

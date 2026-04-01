"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Map as MapIcon } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

interface PropertyDisplayMapProps {
  lat: number;
  lng: number;
  title: string;
  location: string;
}

export default function PropertyDisplayMap({ lat, lng, title, location }: PropertyDisplayMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Only run on client after mount and if we have a container
    if (!mounted || !mapContainerRef.current) return;

    // Use pure Leaflet to bypass ALL react-leaflet lifecycle bugs
    const L = require("leaflet");

    // Clear previous instance if any (to handle HMR or coordinate changes)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const position: [number, number] = [lat, lng];
      
      // Initialize Map instance manually
      const map = L.map(mapContainerRef.current, {
        center: position,
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      // 1. Add Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // 2. Setup Icon Fix
      const defaultIcon = L.icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // 3. Add Marker with custom Popup
      const popupContent = `
        <div style="min-width: 150px; padding: 4px; font-family: sans-serif;">
          <h4 style="font-weight: bold; color: #03045E; margin: 0 0 4px 0; line-height: 1.2;">${title}</h4>
          <div style="font-size: 11px; color: #64748b; font-weight: 500; display: flex; align-items: center; gap: 4px;">
            ${location}
          </div>
        </div>
      `;

      L.marker(position, { icon: defaultIcon })
        .addTo(map)
        .bindPopup(popupContent, { autoPan: false })
        .openPopup();

      mapInstanceRef.current = map;
      
      // Force refresh for Turbopack container size sync and perfectly recenter
      setTimeout(() => {
         map.invalidateSize();
         map.setView(position, 15);
      }, 100);

    } catch (error) {
      console.error("Leaflet initialization failed:", error);
    }
  }, [mounted, lat, lng, title, location]);

  const hasValidCoords = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

  if (!hasValidCoords) {
    return (
      <div className="flex flex-col justify-center items-center h-[280px] w-full bg-slate-50 dark:bg-slate-900 text-slate-400 rounded-lg border border-slate-100 dark:border-slate-800">
        <MapIcon className="w-10 h-10 mb-2 opacity-20" />
        <p className="text-sm font-medium">Map location not available</p>
      </div>
    );
  }

  return (
    <div className="h-[280px] w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100">
      <div 
        ref={mapContainerRef} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        key="map-manual-container"
      />
    </div>
  );
}

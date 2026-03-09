"use client";
import { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Tent,
  TowerControl,
  Landmark,
  Castle,
  Clock3,
  Ship,
  Mountain,
  Building2,
} from "lucide-react";
import { CarouselArrow } from "@/components/common/CarouselArrow";

// ── Map Pattern Background matching reference ───────────────────────────────
const MapBackground = () => (
  <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05] pointer-events-none overflow-hidden text-slate-900 dark:text-white">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="street-map"
          x="0"
          y="0"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          {/* Horizontal streets */}
          <path
            d="M0 30 L40 40 L80 20 L120 50 L160 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
          <path
            d="M0 90 L50 85 L70 115 L120 100 L160 125"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeOpacity="0.4"
          />
          <path
            d="M0 140 L35 150 L65 130 L110 160 L145 140 L160 155"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.7"
          />

          {/* Vertical streets */}
          <path
            d="M30 0 L40 40 L20 85 L45 130 L35 160"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
          <path
            d="M90 0 L80 20 L110 70 L95 110 L125 150 L120 160"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeOpacity="0.3"
          />
          <path
            d="M140 0 L150 55 L130 90 L160 125 M145 140 L150 160"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.8"
          />

          {/* Connectors / Alleys */}
          <path
            d="M40 40 L80 20 M110 70 L120 50 M45 130 L65 130 M125 150 L145 140 M20 85 L50 85 M120 100 L95 110"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#street-map)" />
    </svg>
  </div>
);

// ── City Data with professional Lucide Icons ────────────────────────────────
const CITIES = [
  { name: "Islamabad", count: 289, icon: Tent }, // Faisal Mosque shape
  { name: "Lahore", count: 212, icon: TowerControl }, // Minar-e-Pakistan shape
  { name: "Karachi", count: 183, icon: Landmark }, // Mazar-e-Quaid shape
  { name: "Rawalpindi", count: 76, icon: Castle }, // Rawat Fort shape
  { name: "Faisalabad", count: 54, icon: Clock3 }, // Clock Tower
  { name: "Multan", count: 41, icon: Building2 }, // Historic shrines
  { name: "Peshawar", count: 37, icon: Castle }, // Bala Hisar
  { name: "Gwadar", count: 29, icon: Ship }, // Port / Sea
  { name: "Quetta", count: 18, icon: Mountain }, // Mountains
];

interface BrowseByCityProps {
  onCitySelect?: (city: string) => void;
}

export function BrowseByCity({ onCitySelect }: BrowseByCityProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  return (
    <section className="mb-16 pt-10">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
        Browse Projects by City
      </h2>

      <div className="relative">
        {showLeft && (
          <CarouselArrow
            direction="left"
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })
            }
            className="absolute -left-[18px] top-1/2 -translate-y-1/2 z-20 hidden xl:flex"
          />
        )}

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-hidden pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CITIES.map((city) => {
            const Icon = city.icon;

            return (
              <div
                key={city.name}
                onClick={() => onCitySelect?.(city.name)}
                className="relative flex flex-col justify-between shrink-0 min-w-[280px] sm:min-w-[300px] h-[126px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 cursor-pointer group hover:border-transparent transition-all duration-300 overflow-hidden"
              >
                {/* 1. Subtle Map Background Pattern (Always visible) */}
                <MapBackground />

                {/* 2. Hover Gradient Background (Royal Blue Theme) */}
                {/* It fades in over the white background, but the map is z-index underneath or blended */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-multiply dark:mix-blend-screen"
                  style={{
                    background:
                      "linear-gradient(135deg, #023E8A 0%, rgba(2,62,138,0.7) 100%)",
                  }}
                />

                {/* Additional solid hover bg so it looks solid but lets map show via mix-blend */}
                <div className="absolute inset-0 bg-[#023E8A] opacity-0 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none -z-10" />

                {/* 3. Hover Landmark Icon (Clean Lucide React icons like reference) */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-30 transition-all duration-500 pointer-events-none transform translate-x-4 group-hover:-translate-x-2 drop-shadow-lg">
                  <Icon size={100} strokeWidth={1} />
                </div>

                {/* ── Text content ── */}
                <div className="relative z-10 drop-shadow-sm">
                  <p className="text-[17px] font-bold text-slate-800 dark:text-white group-hover:text-white transition-colors duration-300">
                    {city.name}
                  </p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 group-hover:text-blue-100 transition-colors duration-300">
                    {city.count.toLocaleString()} Projects
                  </p>
                </div>

                {/* ── View Projects link ── */}
                <div className="relative z-10 flex items-center gap-1 text-[#023E8A] text-[13px] font-semibold group-hover:text-white transition-colors duration-300 mt-auto pt-1">
                  View Projects
                  <ArrowUpRight size={14} />
                </div>
              </div>
            );
          })}
        </div>

        {showRight && (
          <CarouselArrow
            direction="right"
            onClick={() =>
              scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })
            }
            className="absolute -right-[18px] top-1/2 -translate-y-1/2 z-20 hidden xl:flex"
          />
        )}
      </div>
    </section>
  );
}

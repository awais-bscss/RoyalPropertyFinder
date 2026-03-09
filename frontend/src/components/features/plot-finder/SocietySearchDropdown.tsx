"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, MapPin } from "lucide-react";

// Move mock societies here or create a shared constant file
// Re-declaring to avoid importing from FullScreenMap which has leaflet
const societies = [
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

interface Society {
  name: string;
  city: string;
  lat: number;
  lng: number;
  plots: number;
}

interface SocietySearchDropdownProps {
  selectedCity: string;
  onSelect: (society: Society) => void;
}

export function SocietySearchDropdown({
  selectedCity,
  onSelect,
}: SocietySearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter societies by city
  const citySocieties = societies.filter((s) => s.city === selectedCity);

  // Then filter by query
  const results = citySocieties.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (society: Society) => {
    setQuery(society.name);
    onSelect(society);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0 && results[activeIdx]) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  if (!selectedCity) return null;

  return (
    <div ref={containerRef} className="relative w-full max-w-md shadow-2xl">
      <div
        className={`flex items-center gap-3 border rounded-full px-5 py-3.5 transition-all bg-white/95 backdrop-blur-md dark:bg-slate-900/95 ${
          isOpen
            ? "border-royal-600 ring-4 ring-royal-600/20"
            : "border-slate-300 dark:border-slate-700 hover:border-royal-400"
        }`}
      >
        <Search className="w-5 h-5 text-royal-600 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIdx(-1);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={`Search societies in ${selectedCity}...`}
          className="flex-1 bg-transparent text-[15px] text-slate-800 dark:text-slate-100 font-semibold focus:outline-none placeholder:text-slate-400 placeholder:font-medium"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full p-1 cursor-pointer shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden max-h-72 overflow-y-auto py-2">
          {citySocieties.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
              <MapPin className="w-5 h-5 opacity-50" />
              <p className="text-[13px] font-medium">
                No societies mapped in {selectedCity} yet.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
              <Search className="w-5 h-5 opacity-50" />
              <p className="text-[13px] font-medium">No societies found</p>
            </div>
          ) : (
            results.map((society, idx) => (
              <button
                key={society.name}
                type="button"
                onMouseDown={() => handleSelect(society)}
                onMouseEnter={() => setActiveIdx(idx)}
                className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors cursor-pointer ${
                  idx === activeIdx
                    ? "bg-royal-50 dark:bg-royal-900/40"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                    <MapPin className="w-4 h-4 text-royal-600 dark:text-royal-400" />
                  </div>
                  <div>
                    <span className="block text-[14px] font-bold text-slate-800 dark:text-slate-200">
                      {society.name}
                    </span>
                    <span className="block text-[12px] font-medium text-slate-500">
                      {society.city}
                    </span>
                  </div>
                </div>
                <div className="bg-royal-100 dark:bg-royal-900/50 text-royal-700 dark:text-royal-400 text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {society.plots} Plots
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

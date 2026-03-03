"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Search, X, ChevronDown } from "lucide-react";

// The package is CommonJS so we import its data directly
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pakistaniCities = require("pakistani-cities-api") as {
  getAllCities: () => Array<{
    name: string;
    province: string;
    population?: number;
  }>;
  searchCityByName: (name: string) => Array<{ name: string; province: string }>;
};

const PROVINCE_COLORS: Record<string, string> = {
  Punjab: "bg-blue-100 text-blue-700",
  Sindh: "bg-green-100 text-green-700",
  "Khyber Pakhtunkhwa": "bg-orange-100 text-orange-700",
  Balochistan: "bg-yellow-100 text-yellow-700",
  "Gilgit-Baltistan": "bg-teal-100 text-teal-700",
  "Azad Jammu & Kashmir": "bg-purple-100 text-purple-700",
  "Islamabad Capital Territory": "bg-red-100 text-red-700",
};

interface CitySearchDropdownProps {
  value: string;
  onChange: (city: string, province: string) => void;
  placeholder?: string;
  className?: string;
}

export function CitySearchDropdown({
  value,
  onChange,
  placeholder = "Search city...",
  className = "",
}: CitySearchDropdownProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<
    Array<{ name: string; province: string }>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

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

  const handleInput = (val: string) => {
    setQuery(val);
    setActiveIdx(-1);
    if (val.trim().length >= 1) {
      const found = pakistaniCities.searchCityByName(val.trim()).slice(0, 12);
      setResults(found);
      setIsOpen(true);
    } else {
      // Show popular cities when empty
      const popular = [
        "Karachi",
        "Lahore",
        "Islamabad",
        "Rawalpindi",
        "Faisalabad",
        "Multan",
        "Peshawar",
        "Quetta",
      ];
      const all = pakistaniCities.getAllCities();
      setResults(all.filter((c) => popular.includes(c.name)).slice(0, 8));
      setIsOpen(true);
    }
  };

  const handleSelect = (city: { name: string; province: string }) => {
    setQuery(city.name);
    onChange(city.name, city.province);
    setIsOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    onChange("", "");
    setResults([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const selectedCity = pakistaniCities
    .getAllCities()
    .find((c) => c.name === value);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className={`flex items-center gap-2 border rounded-xl px-3 py-3 transition-all ${
          isOpen
            ? "border-royal-600 ring-2 ring-royal-600/20 bg-white dark:bg-slate-900"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300"
        }`}
      >
        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => handleInput(query)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[13.5px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none placeholder:text-slate-400"
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </div>

      {/* Selected province badge */}
      {selectedCity && !isOpen && (
        <span
          className={`absolute right-10 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            PROVINCE_COLORS[selectedCity.province] ||
            "bg-slate-100 text-slate-600"
          }`}
        >
          {selectedCity.province === "Islamabad Capital Territory"
            ? "ICT"
            : selectedCity.province === "Khyber Pakhtunkhwa"
              ? "KPK"
              : selectedCity.province === "Azad Jammu & Kashmir"
                ? "AJK"
                : selectedCity.province === "Gilgit-Baltistan"
                  ? "GB"
                  : selectedCity.province}
        </span>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
              <Search className="w-5 h-5" />
              <p className="text-[13px] font-medium">No cities found</p>
              <p className="text-[11px]">Try a different spelling</p>
            </div>
          ) : (
            <>
              {!query && (
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Popular Cities
                  </p>
                </div>
              )}
              {results.map((city, idx) => (
                <button
                  key={`${city.name}-${city.province}`}
                  type="button"
                  onMouseDown={() => handleSelect(city)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                    idx === activeIdx
                      ? "bg-royal-50 dark:bg-royal-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="flex-1 text-[13.5px] font-medium text-slate-700 dark:text-slate-200">
                    {city.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      PROVINCE_COLORS[city.province] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {city.province === "Islamabad Capital Territory"
                      ? "ICT"
                      : city.province === "Khyber Pakhtunkhwa"
                        ? "KPK"
                        : city.province === "Azad Jammu & Kashmir"
                          ? "AJK"
                          : city.province === "Gilgit-Baltistan"
                            ? "GB"
                            : city.province}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

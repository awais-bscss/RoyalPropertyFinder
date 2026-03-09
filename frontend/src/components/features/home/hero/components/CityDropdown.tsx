"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pakistaniCities = require("pakistani-cities-api") as {
  getAllCities: () => Array<{
    name: string;
    province: string;
    population?: number;
  }>;
};

const ALL_CITIES = Array.from(
  new Set(pakistaniCities.getAllCities().map((c) => c.name)),
).sort();

interface CityDropdownProps {
  value: string;
  onChange: (city: string) => void;
}

export function CityDropdown({ value, onChange }: CityDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = ALL_CITIES.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className={cn(
        "flex-1 md:flex-[0.4] relative bg-white rounded-[2px]",
        open ? "z-100" : "z-10",
      )}
      ref={dropdownRef}
    >
      <div
        onClick={() => setOpen(!open)}
        className={cn(
          "px-2 flex flex-col justify-start py-1.5 h-[50px] w-full cursor-pointer transition-all border rounded-[2px]",
          open
            ? "border-slate-400 bg-slate-50"
            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50",
        )}
      >
        <label className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider cursor-pointer">
          City
        </label>
        <div className="h-6 w-full border-none text-slate-900 font-semibold px-1 flex items-center justify-between mt-[-2px]">
          <span className="truncate text-sm font-semibold capitalize">
            {value}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-slate-500 shrink-0 transition-transform",
              open ? "rotate-180" : "",
            )}
          />
        </div>
      </div>

      {open && (
        <div className="absolute top-[52px] left-0 w-full min-w-[200px] bg-white rounded-[4px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-110 border border-slate-300 overflow-hidden text-slate-900 leading-normal">
          {/* Search Input */}
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-[12px] bg-slate-50 border border-slate-200 rounded-[2px] focus:outline-none focus:border-[#023E8A]"
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onChange(city.toLowerCase());
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "w-full text-left py-2 px-3 text-[12px] transition-colors border-b border-slate-50 last:border-0",
                    value.toLowerCase() === city.toLowerCase()
                      ? "bg-[#023E8A] text-white font-bold"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {city}
                </button>
              ))
            ) : (
              <div className="py-4 px-3 text-[12px] text-slate-500 text-center italic">
                No cities found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#f8f9fa] p-1 flex justify-end border-t border-slate-200">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1 bg-[#4C4C4C] hover:bg-slate-800 text-white text-[9px] font-bold rounded-[2px] transition-colors uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

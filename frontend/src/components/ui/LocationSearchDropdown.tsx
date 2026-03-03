"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Search, X, ChevronDown, Loader2 } from "lucide-react";

interface LocationSearchDropdownProps {
  city: string;
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function LocationSearchDropdown({
  city,
  value,
  onChange,
  placeholder = "Search location / society...",
  disabled = false,
}: LocationSearchDropdownProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<
    Array<{ display_name: string; name: string }>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  const searchNominatim = async (searchQuery: string) => {
    if (!searchQuery.trim() || !city) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      const q = encodeURIComponent(`${searchQuery}, ${city}, Pakistan`);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=5`,
      );
      const data = await res.json();

      const mapped = (data || []).map((item: any) => ({
        display_name: item.display_name,
        name: item.name,
      }));
      setResults(mapped);
    } catch (error) {
      console.error("Failed to fetch locations", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (val: string) => {
    setQuery(val);
    setActiveIdx(-1);

    if (!val.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchNominatim(val);
    }, 600);
  };

  const handleSelect = (selectedName: string) => {
    setQuery(selectedName);
    onChange(selectedName);
    setIsOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    onChange("");
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
      handleSelect(results[activeIdx].name);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex items-center gap-2 border rounded-xl px-3 py-3 transition-all ${
          disabled
            ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-80 cursor-not-allowed"
            : isOpen
              ? "border-royal-600 ring-2 ring-royal-600/20 bg-white dark:bg-slate-900"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-royal-400"
        }`}
      >
        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            if (query && city) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Select a city first" : placeholder}
          disabled={disabled}
          className={`flex-1 bg-transparent text-[13.5px] font-medium focus:outline-none placeholder:text-slate-400 disabled:cursor-not-allowed ${
            disabled
              ? "text-slate-500 dark:text-slate-400"
              : "text-slate-700 dark:text-slate-200"
          }`}
          autoComplete="off"
        />
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-royal-600 animate-spin shrink-0" />
        ) : query && !disabled ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-royal-600" />
              <p className="text-[13px] font-medium text-slate-500">
                Searching...
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
              <Search className="w-5 h-5" />
              <p className="text-[13px] font-medium">No locations found</p>
              <p className="text-[11px] px-4 text-center">
                We couldn't find this location in {city}. You can still use it
                though!
              </p>
              <button
                className="mt-2 text-xs text-royal-600 font-semibold px-3 py-1.5 bg-royal-50 rounded-md"
                onClick={() => handleSelect(query)}
              >
                Use "{query}" anyway
              </button>
            </div>
          ) : (
            <div className="py-1">
              <div className="px-3 pt-2 pb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Suggestions in {city}
                </p>
              </div>
              {results.map((loc, idx) => (
                <button
                  key={`${loc.name}-${idx}`}
                  type="button"
                  onMouseDown={() => handleSelect(loc.name)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`w-full flex flex-col items-start px-4 py-2 text-left transition-colors cursor-pointer ${
                    idx === activeIdx
                      ? "bg-royal-50 dark:bg-royal-900/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="text-[13.5px] font-medium text-slate-700 dark:text-slate-200">
                    {loc.name}
                  </span>
                  <span className="text-[10.5px] text-slate-400 line-clamp-1 mt-0.5">
                    {loc.display_name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

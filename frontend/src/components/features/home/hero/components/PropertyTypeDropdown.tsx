"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PROPERTY_CATEGORIES = {
  HOMES: [
    "House",
    "Flat",
    "Upper Portion",
    "Lower Portion",
    "Farm House",
    "Room",
    "Penthouse",
  ],
  PLOTS: [
    "Residential Plot",
    "Commercial Plot",
    "Agricultural Land",
    "Industrial Land",
    "Plot File",
    "Plot Form",
  ],
  COMMERCIAL: ["Office", "Shop", "Warehouse", "Factory", "Building", "Other"],
};

type Category = keyof typeof PROPERTY_CATEGORIES;

export function PropertyTypeDropdown({
  onCategoryChange,
  onTypeChange,
  initialType = "Homes",
  className,
  variant = "hero",
}: {
  onCategoryChange?: (category: Category) => void;
  onTypeChange?: (type: string) => void;
  initialType?: string;
  className?: string;
  variant?: "hero" | "filter";
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Category>("HOMES");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([initialType]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onCategoryChange) {
      onCategoryChange(activeTab);
    }
  }, [activeTab, onCategoryChange]);

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

  const handleToggle = (type: string) => {
    setSelectedTypes([type]);
    if (onTypeChange) onTypeChange(type);
    setOpen(false);
  };

  const handleReset = () => {
    setSelectedTypes(["any"]);
    setActiveTab("HOMES");
    if (onTypeChange) onTypeChange("any");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      className={cn(
        "flex-[0.8] relative bg-white rounded-[2px]",
        open ? "z-100" : "z-10",
        className,
      )}
      ref={dropdownRef}
    >
      {variant === "filter" ? (
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left px-0 py-1 border-b-2 border-slate-200 hover:border-royal-800 transition-colors focus:outline-none group cursor-pointer"
        >
          <p className="text-[14px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5 group-hover:text-royal-800 transition-colors">
            Property Type
          </p>
          <p className="text-[14px] font-bold text-royal-700 flex items-center justify-between gap-2 group-hover:text-royal-900 transition-colors">
            {selectedTypes.length > 0 && selectedTypes[0] !== "any"
              ? selectedTypes.join(", ")
              : "All"}
            <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-royal-800 transition-colors" />
          </p>
        </button>
      ) : (
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
            Property Type
          </label>
          <div className="h-6 w-full border-none text-slate-900 font-semibold px-1 flex items-center justify-between mt-[-2px]">
            <span className="truncate text-sm flex-1 pr-2">
              {selectedTypes.length > 0 && selectedTypes[0] !== "any"
                ? selectedTypes.join(", ")
                : "All"}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-slate-500 shrink-0 transition-transform",
                open ? "rotate-180" : "",
              )}
            />
          </div>
        </div>
      )}

      {open && (
        <div className="absolute top-12 md:top-full left-0 mt-1 w-[280px] sm:w-[350px] bg-white rounded-lg shadow-xl z-20 border border-slate-200 overflow-hidden text-slate-900 leading-normal">
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-2.5 pb-0 border-b border-slate-100">
            {(Object.keys(PROPERTY_CATEGORIES) as Category[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "text-[9px] sm:text-[10px] font-bold tracking-wider px-1 pb-1.5 border-b-[3px] transition-colors uppercase cursor-pointer",
                  activeTab === tab
                    ? "border-[#48CAE4] text-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-200",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-3 bg-white min-h-[120px]">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
              {PROPERTY_CATEGORIES[activeTab].map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => handleToggle(type)}
                    className={cn(
                      "py-1.5 px-2 rounded-[3px] text-[10px] sm:text-[11px] font-medium transition-colors text-center border cursor-pointer truncate",
                      isSelected
                        ? "bg-slate-50 border-slate-300 text-slate-900"
                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-2 bg-white border-t border-slate-100">
            <button
              onClick={handleReset}
              className="text-[11px] hover:underline cursor-pointer font-medium text-slate-600 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleClose}
              className="px-3 py-1 text-[11px] font-bold bg-[#4C4C4C] hover:bg-slate-800 text-white rounded-[3px] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

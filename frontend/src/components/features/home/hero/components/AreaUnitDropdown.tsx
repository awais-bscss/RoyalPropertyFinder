"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const UNITS = [
  "Marla",
  "Kanal",
  "Square Feet",
  "Square Yards",
  "Square Meters",
];

export function AreaUnitDropdown() {
  const [open, setOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("Marla");
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

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        className="text-[#48CAE4] hover:underline"
      >
        Change Area Unit
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[180px] bg-white rounded-[4px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-110 border border-slate-200 overflow-hidden py-1">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Select Area Unit
            </span>
          </div>
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
            {UNITS.map((unit) => (
              <button
                key={unit}
                onClick={() => {
                  setSelectedUnit(unit);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-[12px] flex items-center justify-between hover:bg-slate-50 transition-colors",
                  selectedUnit === unit
                    ? "bg-slate-50 text-[#023E8A] font-bold"
                    : "text-slate-700 font-medium",
                )}
              >
                <span>{unit}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

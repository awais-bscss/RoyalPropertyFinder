"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const BED_OPTIONS = [
  "All",
  "Studio",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10+",
];

export function BedsDropdown({
  onBedsChange,
}: {
  onBedsChange?: (beds: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedBeds, setSelectedBeds] = useState("All");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onBedsChange) {
      onBedsChange(selectedBeds);
    }
  }, [selectedBeds, onBedsChange]);

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
    <div
      className={cn(
        "flex-[0.6] relative bg-white rounded-[2px]",
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
          Beds
        </label>
        <div className="h-6 w-full border-none text-slate-900 font-semibold px-1 flex items-center justify-between mt-[-2px]">
          <span className="truncate text-sm font-semibold">{selectedBeds}</span>
          <ChevronDown
            className={cn(
              "size-4 text-slate-500 shrink-0 transition-transform",
              open ? "rotate-180" : "",
            )}
          />
        </div>
      </div>

      {open && (
        <div className="absolute top-[52px] left-0 w-[150px] bg-white rounded-[4px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-110 border border-slate-300 overflow-hidden text-slate-900 leading-normal">
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
            {BED_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSelectedBeds(opt);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left py-2 px-3 text-[12px] transition-colors border-b border-slate-50 last:border-0",
                  selectedBeds === opt
                    ? "bg-[#023E8A] text-white font-bold"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
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

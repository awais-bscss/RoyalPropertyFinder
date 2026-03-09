"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AREA_UNITS = [
  "Marla",
  "Kanal",
  "Square Feet",
  "Square Yards",
  "Square Meters",
];

const AREA_VALUES = {
  Marla: {
    min: [1, 2, 3, 5, 8, 10, 15, 20],
    max: [2, 3, 5, 8, 10, 15, 20, 25, 40],
  },
  Kanal: {
    min: [1, 2, 4, 8, 10, 20, 50],
    max: [2, 4, 8, 10, 20, 50, 100],
  },
};

export function AreaDropdown({
  onAreaChange,
  className,
  variant = "hero",
}: {
  onAreaChange?: (min: number | string, max: number | string) => void;
  className?: string;
  variant?: "hero" | "filter";
}) {
  const [open, setOpen] = useState(false);
  const [showUnitSelect, setShowUnitSelect] = useState(false);
  const [unit, setUnit] = useState("Marla");
  const [minArea, setMinArea] = useState<number | string>(0);
  const [maxArea, setMaxArea] = useState<number | string>("Any");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onAreaChange) {
      onAreaChange(minArea, maxArea);
    }
  }, [minArea, maxArea, onAreaChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setShowUnitSelect(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={cn(
        "flex-1 relative bg-white rounded-[2px]",
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
            Area Range
          </p>
          <p className="text-[14px] font-bold text-royal-700 flex items-center justify-between gap-2 group-hover:text-royal-900 transition-colors">
            {minArea === 0 && maxArea === "Any"
              ? "0 – Any"
              : `${minArea} to ${maxArea}`}
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
            Area ({unit})
          </label>
          <div className="h-6 w-full border-none text-slate-900 font-semibold px-1 flex items-center justify-between mt-[-2px]">
            <span className="truncate text-sm flex-1 pr-1 font-semibold">
              {minArea} to {maxArea}
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
        <div className="absolute top-12 md:top-full left-0 mt-1 w-[240px] sm:w-[280px] bg-white rounded-lg shadow-xl z-20 border border-slate-200 overflow-hidden text-slate-900 leading-normal">
          {/* Header */}
          <div className="bg-[#f8f9fa] border-b border-slate-200 p-2 flex items-center justify-between">
            <button
              onClick={() => setShowUnitSelect(!showUnitSelect)}
              className="text-[#023E8A] text-[10px] font-bold hover:underline flex items-center gap-1"
            >
              Unit ({unit})
              <ChevronDown className="size-3" />
            </button>
            <button
              onClick={() => {
                setMinArea(0);
                setMaxArea("Any");
              }}
              className="text-[10px] text-slate-500 hover:underline"
            >
              Reset
            </button>
          </div>

          {showUnitSelect ? (
            <div className="p-1.5 grid grid-cols-2 gap-1 bg-white">
              {AREA_UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    setUnit(u);
                    setShowUnitSelect(false);
                  }}
                  className={cn(
                    "py-1 px-3 text-left text-[11px] font-medium border rounded-[2px] transition-colors",
                    unit === u
                      ? "bg-slate-100 border-slate-400 text-[#023E8A]"
                      : "border-slate-100 hover:border-slate-300",
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="p-2 bg-white">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="flex-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5 ml-0.5">
                      Min:
                    </label>
                    <input
                      type="text"
                      placeholder="0"
                      value={minArea === 0 ? "" : minArea}
                      onChange={(e) => setMinArea(e.target.value)}
                      className="w-full h-6 px-1.5 border border-slate-200 rounded-[2px] text-[12px] font-bold text-slate-900 focus:outline-none focus:border-[#023E8A]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5 ml-0.5">
                      Max:
                    </label>
                    <input
                      type="text"
                      placeholder="Any"
                      value={maxArea === "Any" ? "" : maxArea}
                      onChange={(e) => setMaxArea(e.target.value)}
                      className="w-full h-6 px-1.5 border border-slate-200 rounded-[2px] text-[12px] font-bold text-slate-900 focus:outline-none focus:border-[#023E8A]"
                    />
                  </div>
                </div>

                <div className="flex gap-1.5 min-h-[100px]">
                  <div className="flex-1 overflow-y-auto max-h-[130px] pr-0.5 custom-scrollbar">
                    {(
                      AREA_VALUES[unit as keyof typeof AREA_VALUES]?.min || [
                        0, 2, 3, 5, 8, 10, 15, 20,
                      ]
                    ).map((val) => (
                      <button
                        key={`min-${val}`}
                        onClick={() => setMinArea(val)}
                        className={cn(
                          "w-full text-left py-0.5 px-1.5 text-[11px] hover:bg-slate-50 transition-colors rounded-[2px]",
                          minArea === val
                            ? "text-[#023E8A] font-bold"
                            : "text-slate-600",
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[130px] pr-0.5 custom-scrollbar border-l border-slate-100 pl-1">
                    {(
                      AREA_VALUES[unit as keyof typeof AREA_VALUES]?.max || [
                        "Any",
                        2,
                        3,
                        5,
                        8,
                        10,
                        15,
                        20,
                        25,
                        40,
                      ]
                    ).map((val) => (
                      <button
                        key={`max-${val}`}
                        onClick={() => setMaxArea(val)}
                        className={cn(
                          "w-full text-left py-0.5 px-1.5 text-[11px] hover:bg-slate-50 transition-colors rounded-[2px]",
                          maxArea === val
                            ? "text-[#023E8A] font-bold"
                            : "text-slate-600",
                        )}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#f8f9fa] p-1 flex justify-end gap-2 border-t border-slate-200">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-1 bg-[#4C4C4C] hover:bg-slate-800 text-white text-[9px] font-bold rounded-[2px] transition-colors uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

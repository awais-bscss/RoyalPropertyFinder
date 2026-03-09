"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENCIES = ["PKR", "USD", "AED", "GBP", "EUR", "SAR", "CAD", "AUD"];

const PRICE_VALUES = {
  PKR: {
    min: [5000000, 10000000, 25000000, 50000000, 100000000, 500000000],
    max: [
      5000000, 10000000, 50000000, 100000000, 500000000, 1000000000, 5000000000,
    ],
  },
  USD: {
    min: [0, 50000, 100000, 250000, 500000, 1000000],
    max: ["Any", 100000, 250000, 500000, 1000000, 2000000, 5000000],
  },
};

export function PriceDropdown({
  onPriceChange,
  className,
  variant = "hero",
}: {
  onPriceChange?: (min: number | string, max: number | string) => void;
  className?: string;
  variant?: "hero" | "filter";
}) {
  const [open, setOpen] = useState(false);
  const [showCurrencySelect, setShowCurrencySelect] = useState(false);
  const [currency, setCurrency] = useState("PKR");
  const [minPrice, setMinPrice] = useState<number | string>(0);
  const [maxPrice, setMaxPrice] = useState<number | string>("Any");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(minPrice, maxPrice);
    }
  }, [minPrice, maxPrice, onPriceChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setShowCurrencySelect(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPrice = (value: number | string) => {
    if (value === "Any" || value === 0) return value;
    if (typeof value === "string") return value;

    if (value >= 10000000) {
      return (value / 10000000).toFixed(1) + " Crore";
    }
    if (value >= 100000) {
      return (value / 100000).toFixed(0) + " Lakh";
    }
    return value.toLocaleString();
  };

  return (
    <div
      className={cn(
        "flex-1 relative bg-white rounded-[2px]",
        open ? "z-100" : "z-10",
      )}
      ref={dropdownRef}
    >
      {variant === "filter" ? (
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left px-0 py-1 border-b-2 border-slate-200 hover:border-royal-800 transition-colors focus:outline-none group cursor-pointer"
        >
          <p className="text-[14px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5 group-hover:text-royal-800 transition-colors">
            Budget Range
          </p>
          <p className="text-[14px] font-bold text-royal-700 flex items-center justify-between gap-2 group-hover:text-royal-900 transition-colors">
            {minPrice === 0 && maxPrice === "Any"
              ? "0 – Any"
              : `${formatPrice(minPrice)} to ${formatPrice(maxPrice)}`}
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
            Price ({currency})
          </label>
          <div className="h-6 w-full border-none text-slate-900 font-semibold px-1 flex items-center justify-between mt-[-2px]">
            <span className="truncate text-sm flex-1 pr-1 font-semibold">
              {formatPrice(minPrice)} to {formatPrice(maxPrice)}
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
              onClick={() => setShowCurrencySelect(!showCurrencySelect)}
              className="text-[#023E8A] text-[10px] font-bold hover:underline flex items-center gap-1"
            >
              Currency ({currency})
              <ChevronDown className="size-3" />
            </button>
            <button
              onClick={() => {
                setMinPrice(0);
                setMaxPrice("Any");
              }}
              className="text-[10px] text-slate-500 hover:underline"
            >
              Reset
            </button>
          </div>

          {showCurrencySelect ? (
            <div className="p-1.5 grid grid-cols-4 gap-1 bg-white">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrency(c);
                    setShowCurrencySelect(false);
                  }}
                  className={cn(
                    "py-1 text-[11px] font-medium border rounded-[2px] transition-colors",
                    currency === c
                      ? "bg-slate-100 border-slate-400 text-[#023E8A]"
                      : "border-slate-100 hover:border-slate-300",
                  )}
                >
                  {c}
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
                      value={minPrice === 0 ? "" : minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
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
                      value={maxPrice === "Any" ? "" : maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full h-6 px-1.5 border border-slate-200 rounded-[2px] text-[12px] font-bold text-slate-900 focus:outline-none focus:border-[#023E8A]"
                    />
                  </div>
                </div>

                <div className="flex gap-1.5 min-h-[100px]">
                  <div className="flex-1 overflow-y-auto max-h-[130px] pr-0.5 custom-scrollbar">
                    {(
                      PRICE_VALUES[currency as keyof typeof PRICE_VALUES]
                        ?.min || PRICE_VALUES.PKR.min
                    ).map((val) => (
                      <button
                        key={`min-${val}`}
                        onClick={() => setMinPrice(val)}
                        className={cn(
                          "w-full text-left py-0.5 px-1.5 text-[11px] hover:bg-slate-50 transition-colors rounded-[2px]",
                          minPrice === val
                            ? "text-[#023E8A] font-bold"
                            : "text-slate-600",
                        )}
                      >
                        {val === 0 ? "0" : val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[130px] pr-0.5 custom-scrollbar border-l border-slate-100 pl-1">
                    {(
                      PRICE_VALUES[currency as keyof typeof PRICE_VALUES]
                        ?.max || PRICE_VALUES.PKR.max
                    ).map((val) => (
                      <button
                        key={`max-${val}`}
                        onClick={() => setMaxPrice(val)}
                        className={cn(
                          "w-full text-left py-0.5 px-1.5 text-[11px] hover:bg-slate-50 transition-colors rounded-[2px]",
                          maxPrice === val
                            ? "text-[#023E8A] font-bold"
                            : "text-slate-600",
                        )}
                      >
                        {val === "Any" ? "Any" : val.toLocaleString()}
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

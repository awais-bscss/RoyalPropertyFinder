"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "PKR", name: "Pakistan Rupee" },
  { code: "USD", name: "US Dollar" },
  { code: "GBP", name: "British Pound Sterling" },
  { code: "EUR", name: "Euro" },
  { code: "AED", name: "Arab Emirates Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
];

export function CurrencyDropdown() {
  const [open, setOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("PKR");
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
        Change Currency
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[240px] bg-white rounded-[4px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-110 border border-slate-200 overflow-hidden py-1">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Select Currency
            </span>
          </div>
          <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => {
                  setSelectedCurrency(currency.code);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-[12px] flex items-center justify-between hover:bg-slate-50 transition-colors",
                  selectedCurrency === currency.code
                    ? "bg-slate-50 text-[#023E8A] font-bold"
                    : "text-slate-700 font-medium",
                )}
              >
                <span>{currency.name}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {currency.code}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

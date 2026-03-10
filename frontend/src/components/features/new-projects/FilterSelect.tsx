"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative flex-1 min-w-[140px]">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full text-left px-0 py-1 border-b-2 transition-colors focus:outline-none group cursor-pointer",
          open ? "border-royal-800" : "border-slate-200 hover:border-royal-800",
        )}
      >
        <p
          className={cn(
            "text-[14px] uppercase tracking-wide font-semibold mb-0.5 transition-colors",
            open
              ? "text-royal-800"
              : "text-slate-500 group-hover:text-royal-800",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-[14px] font-bold flex items-center justify-between gap-2 transition-colors",
            open
              ? "text-royal-900"
              : "text-royal-700 group-hover:text-royal-900",
          )}
        >
          {selected?.label ?? placeholder}
          <ChevronDown
            className={cn(
              "w-5 h-5 text-slate-400 shrink-0 transition-all group-hover:text-royal-800",
              open ? "rotate-180 text-royal-800" : "",
            )}
          />
        </p>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 z-20 min-w-[200px] overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder={`Search ${label.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-[12px] bg-slate-50 border border-slate-200 rounded-[2px] focus:outline-none focus:border-royal-800"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-[220px] overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-[13px] transition-colors border-b border-slate-50 last:border-0",
                    value === opt.value
                      ? "bg-[#023E8A] text-white font-bold"
                      : "text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {opt.label}
                </button>
              ))
            ) : (
              <p className="py-4 px-3 text-[12px] text-slate-500 text-center italic">
                No results found
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-1.5 flex justify-end border-t border-slate-200">
            <button
              onClick={() => {
                setOpen(false);
                setSearch("");
              }}
              className="px-3 py-1 bg-[#4C4C4C] hover:bg-slate-800 text-white text-[9px] font-bold rounded-[2px] transition-colors uppercase tracking-wider cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

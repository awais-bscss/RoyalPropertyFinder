"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative flex-1 min-w-[140px]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-0 py-1 border-b-2 border-slate-200 hover:border-royal-800 transition-colors focus:outline-none group cursor-pointer"
      >
        <p className="text-[14px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5 group-hover:text-royal-800 transition-colors">
          {label}
        </p>
        <p className="text-[14px] font-bold text-royal-700 flex items-center justify-between gap-2 group-hover:text-royal-900 transition-colors">
          {selected?.label ?? placeholder}
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 group-hover:text-royal-800 transition-colors" />
        </p>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 z-20 min-w-[180px] py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                  value === opt.value
                    ? "text-royal-800 font-bold"
                    : "text-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

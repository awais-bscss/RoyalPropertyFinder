// Shared primitive UI components — enlarged text & icons

import { ChevronDown } from "lucide-react";

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({
  step,
  label,
  icon,
}: {
  step: number;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-5 mb-7">
      <div className="w-14 h-14 rounded-xl bg-royal-50 dark:bg-royal-900/20 border border-royal-100 dark:border-royal-800/30 flex items-center justify-center text-royal-700 dark:text-royal-400 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
          Step {step}
        </p>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          {label}
        </h3>
      </div>
    </div>
  );
}

// ─── FieldLabel ───────────────────────────────────────────────────────────────
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
      {children}
    </p>
  );
}

// ─── SelectDropdown ───────────────────────────────────────────────────────────
export function SelectDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-[15px] font-medium transition-all pr-11 ${
          disabled
            ? "opacity-80 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-700"
            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-royal-600/30 focus:border-royal-600 cursor-pointer hover:border-royal-400"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ─── PillButton ───────────────────────────────────────────────────────────────
export function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-[14.5px] font-semibold border transition-all cursor-pointer ${
        active
          ? "bg-royal-800 text-white border-royal-800 shadow-sm"
          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-royal-400 hover:text-royal-700"
      }`}
    >
      {children}
    </button>
  );
}

// ─── NumberBubble ─────────────────────────────────────────────────────────────
export function NumberBubble({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-12 h-12 rounded-full text-[14.5px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
        active
          ? "bg-royal-800 text-white border-royal-800 shadow"
          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-royal-400 hover:text-royal-700"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${
        checked ? "bg-royal-700" : "bg-slate-300 dark:bg-slate-600"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── SectionCard ──────────────────────────────────────────────────────────────
export function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 shadow-sm">
      {children}
    </div>
  );
}

"use client";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export function TextInput({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
  icon: Icon,
}: {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
  icon?: any;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full ${Icon ? "pl-9" : "pl-3.5"} pr-3.5 py-2.5 text-[13px] rounded-sm border
          border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900
          text-slate-700 dark:text-slate-200 placeholder:text-slate-400
          focus:outline-none focus:border-royal-500 transition-colors
          disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:cursor-not-allowed disabled:text-slate-400 shadow-sm`}
      />
    </div>
  );
}

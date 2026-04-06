"use client";

import { useState } from "react";
import { Key, Eye, EyeOff } from "lucide-react";

export function PasswordInput({ placeholder, value, onChange }: { placeholder?: string, value?: string, onChange?: (e: any) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder ?? "••••••••"}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-10 py-2.5 text-[13px] rounded-sm border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 placeholder:text-slate-400
          focus:outline-none focus:border-royal-500 transition-colors shadow-sm"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
      >
        {show ? (
          <EyeOff className="w-3.5 h-3.5" />
        ) : (
          <Eye className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

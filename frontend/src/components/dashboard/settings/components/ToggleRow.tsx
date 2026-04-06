"use client";

import { useState } from "react";

export function ToggleRow({
  title,
  desc,
  defaultChecked,
}: {
  title: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="pr-4">
        <p className="text-[16px] font-bold text-slate-900 dark:text-white">
          {title}
        </p>
        <p className="text-[14px] font-medium text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative shrink-0 inline-flex h-6 w-[42px] items-center rounded-full transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-royal-500/20 ${
          checked ? "bg-royal-600" : "bg-slate-200 dark:bg-slate-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-[4px]"
          }`}
        />
      </button>
    </div>
  );
}

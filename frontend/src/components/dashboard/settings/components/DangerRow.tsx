"use client";

export function DangerRow({
  icon: Icon,
  label,
  desc,
}: {
  icon: any;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-start gap-4 pr-4">
        <div className="w-10 h-10 rounded-sm bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <p className="text-[16px] font-bold text-slate-900 dark:text-white">
            {label}
          </p>
          <p className="text-[14px] font-medium text-slate-500 mt-1 leading-relaxed">{desc}</p>
        </div>
      </div>
      <button className="text-[14px] font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 px-5 py-2.5 rounded-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer whitespace-nowrap shadow-sm">
        {label}
      </button>
    </div>
  );
}

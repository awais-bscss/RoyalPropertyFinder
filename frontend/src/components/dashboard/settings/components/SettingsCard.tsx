"use client";

export function SettingsCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
        <p className="text-[16px] font-bold text-slate-900 dark:text-white">
          {title}
        </p>
        {description && (
          <p className="text-[13px] font-medium text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>
      {/* Card Body */}
      <div className="p-5">{children}</div>
      {/* Card Footer */}
      {footer && (
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex justify-end gap-2 text-right">
          {footer}
        </div>
      )}
    </div>
  );
}

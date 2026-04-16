"use client";

import { Trash2, X, AlertTriangle } from "lucide-react";

interface Props {
  reportTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteReportModal({ reportTitle, onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 z-[1000]"
    >
      <div className="bg-white dark:bg-slate-900 rounded-sm shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Delete Report
              </h3>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">Permanent Action</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 mb-4 animate-pulse">
             <AlertTriangle size={24} />
          </div>
          <p className="text-[14px] text-slate-700 dark:text-slate-300 font-bold mb-2">
            Are you sure you want to delete this report?
          </p>
          <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed px-4">
            This will permanently remove the report for <span className="text-slate-900 dark:text-white font-bold">"{reportTitle}"</span>. You cannot undo this action.
          </p>
        </div>

        {/* Actions */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end rounded-b-sm">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-sm text-[12px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-sm text-[12px] font-black bg-rose-600 hover:bg-rose-700 text-white transition-shadow shadow-lg shadow-rose-600/20 cursor-pointer"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

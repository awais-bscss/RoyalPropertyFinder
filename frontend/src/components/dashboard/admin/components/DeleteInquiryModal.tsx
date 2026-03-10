"use client";

import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";
import type { SupportInquiry } from "../types";

interface Props {
  inquiry: SupportInquiry;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteInquiryModal({
  inquiry,
  onConfirm,
  onCancel,
  isDeleting,
}: Props) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-500/20">
            <Trash2 className="w-6 h-6 text-rose-600" />
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-5">
          <h3 className="font-black text-slate-900 dark:text-white text-[18px] leading-tight">
            Delete Inquiry?
          </h3>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            You are about to delete the inquiry: <br />
            <strong className="text-slate-900 dark:text-slate-200 font-bold block mt-1">
              "{inquiry.subject}"
            </strong>
            from <span className="font-bold">{inquiry.senderName}</span>.
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-3.5 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[12px] text-amber-700 dark:text-amber-400 font-medium leading-normal">
              Warning: This action is permanent. All message history for this
              ticket will be lost from the dashboard.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-xl text-[13px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-[1.5] py-3 rounded-xl text-[13px] font-black bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-rose-400"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete Forever"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

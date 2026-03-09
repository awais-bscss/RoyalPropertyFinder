"use client";

import { useState } from "react";
import { XCircle, X } from "lucide-react";
import type { Listing } from "../types";

interface Props {
  listing: Listing;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export function RejectModal({ listing, onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState("");
  const presets = [
    "Complete property information is missing",
    "Images are low quality or misleading",
    "Price is unrealistic for this area",
    "Duplicate listing already exists",
    "Potentially fraudulent information",
    "Violates platform listing policies",
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ zIndex: 200 }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Reject Listing
              </h3>
              <p className="text-[12px] text-slate-500">{listing.title}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setReason(p)}
                className={`text-[12px] px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                  reason === p
                    ? "bg-rose-600 text-white border-rose-600"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-rose-300 hover:text-rose-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Custom reason..."
            className="w-full text-[13px] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-400 resize-none"
          />
        </div>

        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm(reason || "Did not meet listing standards.")
            }
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

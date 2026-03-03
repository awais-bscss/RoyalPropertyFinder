"use client";

import { CheckCircle2, X } from "lucide-react";
import { AMENITIES_OPTIONS } from "@/components/dashboard/post-listing/constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedAmenities: string[];
  toggleAmenity: (a: string) => void;
}

export function AmenitiesModal({
  isOpen,
  onClose,
  selectedAmenities,
  toggleAmenity,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-xl mx-4 p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-[18px] font-bold text-slate-800 dark:text-white">
            Select Amenities
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
          {AMENITIES_OPTIONS.map((a) => {
            const selected = selectedAmenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-[14.5px] font-medium text-left transition-all cursor-pointer ${
                  selected
                    ? "bg-royal-50 dark:bg-royal-900/20 border-royal-300 dark:border-royal-700 text-royal-700 dark:text-royal-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-royal-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selected
                      ? "border-royal-700 bg-royal-700"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {selected && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </span>
                {a}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[14px] text-slate-500">
            <CheckCircle2
              className={`w-5 h-5 ${selectedAmenities.length >= 5 ? "text-green-500" : "text-slate-300"}`}
            />
            {selectedAmenities.length} selected
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-royal-800 text-white rounded-xl text-[15px] font-bold hover:bg-royal-700 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

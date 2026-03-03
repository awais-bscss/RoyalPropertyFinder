"use client";

import { Landmark, MonitorCheck } from "lucide-react";
import {
  SectionHeader,
  SectionCard,
} from "@/components/dashboard/post-listing/components/ui";

interface Props {
  platformRPF: boolean;
  setPlatformRPF: (v: boolean) => void;
}

export function PlatformSection({ platformRPF, setPlatformRPF }: Props) {
  return (
    <SectionCard>
      <SectionHeader
        step={7}
        label="Platform Selection"
        icon={<MonitorCheck className="w-6 h-6" />}
      />
      <p className="text-[15px] text-slate-500 mb-5 -mt-2">
        Select where you want to publish your listing.
      </p>

      <button
        type="button"
        onClick={() => setPlatformRPF(!platformRPF)}
        className={`w-full flex items-center gap-5 px-6 py-5 rounded-xl border-2 transition-all cursor-pointer ${
          platformRPF
            ? "border-royal-700 bg-royal-50 dark:bg-royal-900/20"
            : "border-slate-200 dark:border-slate-700 hover:border-royal-300"
        }`}
      >
        {/* Checkbox */}
        <span
          className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
            platformRPF
              ? "border-royal-700 bg-royal-700"
              : "border-slate-300 dark:border-slate-600"
          }`}
        >
          {platformRPF && (
            <svg
              viewBox="0 0 12 10"
              fill="none"
              className="w-3.5 h-3.5"
              stroke="white"
              strokeWidth={2.5}
            >
              <path
                d="M1 5l3 4L11 1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        {/* Branding */}
        <div className="flex items-center gap-3">
          <Landmark className="w-8 h-8 text-royal-700 dark:text-royal-400" />
          <div className="text-left">
            <p className="text-[17px] font-black text-royal-800 dark:text-royal-400 leading-tight">
              Royal
              <span className="text-slate-700 dark:text-white"> Property</span>
            </p>
            <p className="text-[12px] font-semibold text-slate-400 tracking-wider uppercase">
              Har Pata, Humain Pata Hai
            </p>
          </div>
        </div>
      </button>
    </SectionCard>
  );
}

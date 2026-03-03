"use client";

import { FileText } from "lucide-react";
import {
  SectionHeader,
  SectionCard,
  FieldLabel,
} from "@/components/dashboard/post-listing/components/ui";

interface Props {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
}

const inputCls =
  "w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3.5 text-[15px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-royal-600/30 focus:border-royal-600 transition-all";

export function AdInfoSection({
  title,
  setTitle,
  description,
  setDescription,
}: Props) {
  return (
    <SectionCard>
      <SectionHeader
        step={4}
        label="Ad Information"
        icon={<FileText className="w-6 h-6" />}
      />

      {/* Title */}
      <div className="mb-6">
        <FieldLabel>
          <span className="font-black text-royal-600 text-xl leading-none">
            T
          </span>{" "}
          Title
        </FieldLabel>
        <input
          type="text"
          placeholder="e.g. Beautiful House in DHA Phase 5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={150}
          className={inputCls}
        />
        <p className="text-right text-sm text-slate-400 mt-1.5">
          {title.length}/150
        </p>
      </div>

      {/* Description */}
      <div>
        <FieldLabel>
          <span className="text-royal-600 text-lg">≡</span> Description
        </FieldLabel>
        <textarea
          rows={6}
          placeholder="Describe your property, its features, the area it is in, etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={3000}
          className={`${inputCls} resize-none`}
        />
        <p className="text-right text-sm text-slate-400 mt-1.5">
          {description.length}/3000
        </p>
      </div>
    </SectionCard>
  );
}

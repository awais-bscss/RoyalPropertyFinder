"use client";

import { BedDouble, Bath, CheckCircle2, Plus, X } from "lucide-react";
import {
  SectionHeader,
  SectionCard,
  FieldLabel,
  NumberBubble,
} from "@/components/dashboard/post-listing/components/ui";
import {
  BEDROOMS,
  BATHROOMS,
} from "@/components/dashboard/post-listing/constants";

interface Props {
  bedrooms: string;
  setBedrooms: (v: string) => void;
  bathrooms: string;
  setBathrooms: (v: string) => void;
  selectedAmenities: string[];
  amenityScore: number;
  toggleAmenity: (a: string) => void;
  setShowAmenitiesModal: (v: boolean) => void;
}

export function FeaturesSection({
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  selectedAmenities,
  amenityScore,
  toggleAmenity,
  setShowAmenitiesModal,
}: Props) {
  return (
    <SectionCard>
      <SectionHeader
        step={3}
        label="Features and Amenities"
        icon={<BedDouble className="w-6 h-6" />}
      />

      {/* Bedrooms */}
      <div className="mb-6">
        <FieldLabel>
          <BedDouble className="w-5 h-5 text-royal-600" /> Bedrooms
        </FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {BEDROOMS.map((b) => (
            <NumberBubble
              key={b}
              active={bedrooms === b}
              onClick={() => setBedrooms(b)}
            >
              {b}
            </NumberBubble>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="mb-7">
        <FieldLabel>
          <Bath className="w-5 h-5 text-royal-600" /> Bathrooms
        </FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {BATHROOMS.map((b) => (
            <NumberBubble
              key={b}
              active={bathrooms === b}
              onClick={() => setBathrooms(b)}
            >
              {b}
            </NumberBubble>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <FieldLabel>Features and Amenities</FieldLabel>
            <p className="text-sm text-slate-400 -mt-2">
              Add parking spaces, waste disposal, internet, etc.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAmenitiesModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-royal-800 text-white text-[15px] font-bold hover:bg-royal-700 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" /> Add Amenities
          </button>
        </div>

        {/* Chips */}
        {selectedAmenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {selectedAmenities.map((a) => (
              <span
                key={a}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-royal-50 dark:bg-royal-900/20 border border-royal-200 dark:border-royal-800/40 text-[14px] font-semibold text-royal-700 dark:text-royal-400"
              >
                <CheckCircle2 className="w-4 h-4" />
                {a}
                <button
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className="ml-0.5 text-royal-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Quality tip */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl px-5 py-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <CheckCircle2
              className={`w-6 h-6 ${amenityScore >= 100 ? "text-green-500" : "text-slate-400"}`}
            />
            <div>
              <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                Quality Tip
              </p>
              <p className="text-sm text-slate-400">Add at least 5 amenities</p>
            </div>
          </div>
          <span
            className={`text-[15px] font-black ${amenityScore >= 100 ? "text-green-600" : "text-red-500"}`}
          >
            {amenityScore}%
          </span>
        </div>
      </div>
    </SectionCard>
  );
}

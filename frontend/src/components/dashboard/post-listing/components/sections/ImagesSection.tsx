"use client";

import { RefObject } from "react";
import { ImageIcon, Upload, CheckCircle2, Video, X } from "lucide-react";
import {
  SectionHeader,
  SectionCard,
  FieldLabel,
} from "@/components/dashboard/post-listing/components/ui";

interface Props {
  images: File[];
  coverIdx: number;
  setCoverIdx: (i: number) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (i: number) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  imageScore: number;
  videoLinks: string[];
  videoInput: string;
  setVideoInput: (v: string) => void;
  addVideoLink: () => void;
  removeVideoLink: (i: number) => void;
}

export function ImagesSection({
  images,
  coverIdx,
  setCoverIdx,
  handleImageUpload,
  removeImage,
  fileInputRef,
  imageScore,
  videoLinks,
  videoInput,
  setVideoInput,
  addVideoLink,
  removeVideoLink,
}: Props) {
  return (
    <SectionCard>
      <SectionHeader
        step={5}
        label="Property Images and Videos"
        icon={<ImageIcon className="w-6 h-6" />}
      />

      {/* Upload zone */}
      <FieldLabel>Upload Images of your Property</FieldLabel>
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-5">
        <div className="flex flex-col sm:flex-row">
          {/* Left */}
          <div className="flex flex-col items-center justify-center gap-4 p-8 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 sm:w-60 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-royal-800 hover:bg-royal-700 text-white font-bold px-5 py-3 rounded-lg text-[15px] transition-colors cursor-pointer"
            >
              <Upload className="w-5 h-5" /> Upload Images
            </button>
            <div className="flex flex-col items-center gap-2 text-slate-400 cursor-pointer hover:text-royal-600 transition-colors">
              <ImageIcon className="w-10 h-10" />
              <span className="text-[14px] font-semibold">Image Bank</span>
            </div>
            <p className="text-sm text-slate-400 text-center">
              Max size 5MB · JPG or PNG only
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          {/* Right: tips */}
          <div className="flex-1 p-8 flex flex-col justify-center gap-4">
            {[
              "Ads with pictures get 5x more views.",
              "Upload good quality pictures with proper lighting.",
              "Double click on any image to set it as the cover.",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-[14.5px] text-slate-600 dark:text-slate-400">
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mb-5">
          {images.map((img, idx) => (
            <div
              key={idx}
              onDoubleClick={() => setCoverIdx(idx)}
              className={`relative group rounded-xl overflow-hidden aspect-square border-2 cursor-pointer transition-all ${
                coverIdx === idx
                  ? "border-royal-700 shadow-md"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <img
                src={URL.createObjectURL(img)}
                alt={`upload-${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {coverIdx === idx && (
                <span className="absolute bottom-1 left-1 text-[9px] font-black bg-royal-800 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image quality tip */}
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl px-5 py-4 border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle2
            className={`w-6 h-6 ${imageScore >= 100 ? "text-green-500" : "text-slate-400"}`}
          />
          <div>
            <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
              Quality Tip
            </p>
            <p className="text-sm text-slate-400">
              {imageScore >= 100
                ? "Great! You have enough images."
                : `Add at least ${5 - images.length} more image${5 - images.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <span
          className={`text-[15px] font-black ${imageScore >= 100 ? "text-green-600" : "text-red-500"}`}
        >
          {imageScore}%
        </span>
      </div>

      {/* Video */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
        <FieldLabel>
          <Video className="w-5 h-5 text-royal-600" /> Add Videos of your
          Property
        </FieldLabel>
        <p className="text-sm text-slate-400 mb-4 -mt-2">
          Add videos from YouTube — paste the link below.
        </p>
        <div className="flex gap-3 mb-4">
          <input
            type="url"
            placeholder="Paste YouTube video link here"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addVideoLink())
            }
            className="flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3.5 text-[15px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-royal-600/30 focus:border-royal-600 transition-all"
          />
          <button
            type="button"
            onClick={addVideoLink}
            className="px-5 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-[15px] font-bold text-slate-600 dark:text-slate-400 hover:border-royal-400 hover:text-royal-700 transition-all cursor-pointer whitespace-nowrap"
          >
            Add Video
          </button>
        </div>
        {videoLinks.length > 0 && (
          <div className="space-y-2.5">
            {videoLinks.map((link, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-[14px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <Video className="w-4 h-4 text-royal-600 shrink-0" />
                <span className="flex-1 truncate">{link}</span>
                <button
                  type="button"
                  onClick={() => removeVideoLink(i)}
                  className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

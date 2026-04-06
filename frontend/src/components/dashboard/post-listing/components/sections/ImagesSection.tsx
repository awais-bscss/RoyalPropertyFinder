"use client";

import { RefObject } from "react";
import { ImageIcon, Upload, CheckCircle2, Video, X } from "lucide-react";
import {
  SectionHeader,
  SectionCard,
  FieldLabel,
} from "@/components/dashboard/post-listing/components/ui";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  images: Array<{ id: string; file: File }>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (idx: number) => void;
  reorderImages: (oldIndex: number, newIndex: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imageScore: number;
  videoLinks: string[];
  videoInput: string;
  setVideoInput: (v: string) => void;
  addVideoLink: () => void;
  removeVideoLink: (i: number) => void;
}

// Draggable Image Wrapper
function SortableImage({
  id,
  idx,
  img,
  isCover,
  onRemove,
}: {
  id: string;
  idx: number;
  img: File;
  isCover: boolean;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition-all ${
        isCover
          ? "border-royal-700 shadow-md ring-2 ring-royal-500/10"
          : "border-slate-200 dark:border-slate-700"
      }`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <img
          src={URL.createObjectURL(img)}
          alt={`upload-${idx}`}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
      
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer z-30 shadow-md"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {isCover && (
        <span className="absolute bottom-1 left-1 text-[9px] font-black bg-royal-800 text-white px-2.5 py-1 rounded-full uppercase tracking-wider z-20 shadow-sm flex items-center gap-1">
          <ImageIcon className="w-2.5 h-2.5" /> Cover Photo
        </span>
      )}
    </div>
  );
}

export function ImagesSection({
  images,
  handleImageUpload,
  removeImage,
  reorderImages,
  fileInputRef,
  imageScore,
  videoLinks,
  videoInput,
  setVideoInput,
  addVideoLink,
  removeVideoLink,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      reorderImages(oldIndex, newIndex);
    }
  };

  return (
    <SectionCard>
      <SectionHeader
        step={5}
        label="Property Images and Videos"
        icon={<ImageIcon className="w-6 h-6" />}
      />

      {/* Upload zone */}
      <FieldLabel>Upload Images of your Property</FieldLabel>
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mb-5 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col sm:flex-row">
          {/* Left */}
          <div className="flex flex-col items-center justify-center gap-4 p-8 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 sm:w-60 shrink-0 bg-slate-50/50 dark:bg-slate-800/10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-royal-800 hover:bg-royal-700 text-white font-bold px-5 py-3 rounded-lg text-[15px] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Upload className="w-5 h-5" /> Upload Images
            </button>
            <div 
               onClick={() => fileInputRef.current?.click()}
               className="flex flex-col items-center gap-2 text-slate-400 cursor-pointer hover:text-royal-600 transition-colors"
            >
              <ImageIcon className="w-10 h-10" />
              <span className="text-[14px] font-semibold">Image Bank</span>
            </div>
            <p className="text-xs text-slate-400 text-center font-medium">
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
          <div className="flex-1 p-8 flex flex-col justify-center gap-4 bg-white dark:bg-slate-900/40">
            {[
              "Ads with pictures get 5x more views.",
              "Upload good quality pictures with proper lighting.",
              "The first image is your property cover. Drag to reorder.",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-[14.5px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Previews (Drag and Drop Sortable) */}
      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={images.map(img => img.id)} 
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-6">
              {images.map((imgObj, idx) => (
                <SortableImage
                  key={imgObj.id}
                  id={imgObj.id}
                  idx={idx}
                  img={imgObj.file}
                  isCover={idx === 0}
                  onRemove={() => removeImage(idx)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Image quality tip */}
      <div className="flex items-center justify-between bg-emerald-50/40 dark:bg-emerald-500/5 rounded-xl px-5 py-4 border border-emerald-100 dark:border-emerald-500/20 mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle2
            className={`w-6 h-6 ${imageScore >= 100 ? "text-emerald-500" : "text-slate-400"}`}
          />
          <div>
            <p className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
              Listing Quality
            </p>
            <p className="text-sm text-slate-500 font-medium">
              {imageScore >= 100
                ? "Excellent! Your listing has enough high-quality images."
                : `Add at least ${5 - images.length} more image${5 - images.length !== 1 ? "s" : ""} to reach 100%.`}
            </p>
          </div>
        </div>
        <span
          className={`text-[15px] font-black ${imageScore >= 100 ? "text-emerald-600" : "text-rose-500"}`}
        >
          {imageScore}%
        </span>
      </div>

      {/* Video */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
        <FieldLabel>
          <Video className="w-5 h-5 text-royal-600" /> YouTube Video Links
        </FieldLabel>
        <p className="text-[14px] text-slate-500 mb-4 -mt-2 font-medium">
          Copy and paste YouTube links to showcase a video tour of your property.
        </p>
        <div className="flex gap-3 mb-4">
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addVideoLink())
            }
            className="flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-4 py-3.5 text-[15px] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-royal-600/20 focus:border-royal-600 transition-all shadow-sm"
          />
          <button
            type="button"
            onClick={addVideoLink}
            className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl text-[15px] font-bold text-slate-600 dark:text-slate-400 hover:border-royal-400 hover:text-royal-800 dark:hover:text-royal-300 transition-all cursor-pointer whitespace-nowrap bg-white dark:bg-slate-900 shadow-sm active:scale-95"
          >
            Add Link
          </button>
        </div>
        {videoLinks.length > 0 && (
          <div className="space-y-2.5">
            {videoLinks.map((link, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-[14px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 group hover:border-royal-300 transition-colors"
              >
                <Video className="w-4 h-4 text-royal-600 shrink-0" />
                <span className="flex-1 truncate font-medium">{link}</span>
                <button
                  type="button"
                  onClick={() => removeVideoLink(i)}
                  className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
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

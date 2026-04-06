"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, MapPin, X, Building2 } from "lucide-react";
import { LISTING_STATUS, timeAgo } from "../types";
import { formatPrice } from "@/lib/utils";
import type { Listing } from "../types";

interface Props {
  listing: Listing;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  actionLoading: boolean;
}

export function ListingDrawer({
  listing,
  onApprove,
  onReject,
  onClose,
  actionLoading,
}: Props) {
  const sc = LISTING_STATUS[listing.status];
  const [activeIdx, setActiveIdx] = useState(0);
  const validImages = (listing.images || []).filter(img => img && img.trim() !== "");

  return (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 100 }}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-[16px] leading-tight">
              {listing.title}
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {listing.location}, {listing.city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Cover Image */}
        <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
           {validImages.length > 0 ? (
             <img 
               src={validImages[activeIdx] || validImages[0]} 
               alt="Property cover" 
               className="w-full h-full object-cover transition-all duration-300" 
             />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <Building2 className="w-12 h-12 opacity-20" />
                <span className="text-[12px] font-bold uppercase tracking-widest opacity-40">No Images Available</span>
             </div>
           )}
           <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border shadow-lg ${sc.cls} bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm`}>
                 <sc.icon className="w-3 h-3" />
                 {sc.label}
              </span>
           </div>
           {validImages.length > 1 && (
             <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-bold px-2 py-1 rounded-full">
               {activeIdx + 1} / {validImages.length}
             </div>
           )}
        </div>

        {/* Thumbnail Strip */}
        {validImages.length > 0 && (
          <div
            className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {validImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                style={{ WebkitScrollbar: "none" } as any}
                className={`w-20 h-16 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer border-2 ${
                  i === activeIdx
                    ? "border-royal-600 opacity-100 shadow-md"
                    : "border-transparent opacity-85 hover:opacity-100 hover:border-slate-300"
                }`}
              >
                <img
                  src={img}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="p-4 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-[11px] text-slate-500 uppercase tracking-[0.1em] font-black">{listing.purpose} Property</p>
              <p className="text-[22px] font-black text-royal-600">
                {formatPrice(listing.currency, listing.price)}
              </p>
            </div>
          </div>

          {listing.rejectionReason && (
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-lg p-2.5">
              <p className="text-[11px] font-bold text-rose-700 mb-0.5 uppercase tracking-wide">
                Rejection Reason
              </p>
              <p className="text-[13px] text-rose-600">
                {listing.rejectionReason}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Type", value: listing.subtype },
              {
                label: "Area",
                value: `${listing.areaSize} ${listing.areaUnit}`,
              },
              ...(listing.bedrooms
                ? [{ label: "Bedrooms", value: listing.bedrooms }]
                : []),
              ...(listing.bathrooms
                ? [{ label: "Bathrooms", value: listing.bathrooms }]
                : []),
              { label: "Province", value: listing.province },
              { label: "Submitted", value: timeAgo(listing.createdAt) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 flex flex-col justify-center"
              >
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-0.5">
                  {label}
                </p>
                <p className="text-[13px] font-black text-slate-800 dark:text-white uppercase truncate">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Submitted by */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-3 bg-slate-50/30 dark:bg-slate-800/20">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">
              Submitted By
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-royal-700 text-white flex items-center justify-center font-bold text-sm uppercase overflow-hidden">
                {listing.user?.profilePic && listing.user.profilePic.trim() !== "" ? (
                  <img
                    src={listing.user.profilePic}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  listing.user?.name?.[0]
                )}
              </div>
              <div>
                <p className="font-bold text-[14px] text-slate-800 dark:text-white">
                  {listing.user?.name}
                </p>
                <p className="text-[12px] text-slate-500">
                  {listing.user?.email}
                </p>
                {listing.user?.phone && (
                  <p className="text-[12px] text-slate-500">
                    {listing.user.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {listing.status === "pending" && (
          <div className="sticky bottom-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3">
            <button
              onClick={onReject}
              className="flex-1 py-3 rounded-xl font-bold text-[14px] text-rose-600 border border-rose-200 hover:bg-rose-50 cursor-pointer transition-colors"
            >
              Reject
            </button>
            <button
              onClick={onApprove}
              disabled={actionLoading}
              className="flex-1 py-3 rounded-xl font-bold text-[14px] bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}{" "}
              Approve Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { CheckCircle2, Loader2, MapPin, X } from "lucide-react";
import { LISTING_STATUS, formatPrice, timeAgo } from "../types";
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

        {/* Images */}
        {listing.images.length > 0 && (
          <div className="flex gap-2 p-4 overflow-x-auto">
            {listing.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-48 h-32 object-cover rounded-xl shrink-0 border border-slate-200"
              />
            ))}
          </div>
        )}

        {/* Details */}
        <div className="p-5 space-y-5 flex-1">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-full border ${sc.cls}`}
            >
              <sc.icon className="w-3.5 h-3.5" />
              {sc.label}
            </span>
            <div className="text-right">
              <p className="text-[20px] font-black text-slate-900 dark:text-white">
                {formatPrice(listing.currency, listing.price)}
              </p>
              <p className="text-[12px] text-slate-500">{listing.purpose}</p>
            </div>
          </div>

          {listing.rejectionReason && (
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl p-3">
              <p className="text-[12px] font-bold text-rose-700 mb-1">
                Rejection Reason
              </p>
              <p className="text-[13px] text-rose-600">
                {listing.rejectionReason}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
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
                className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3"
              >
                <p className="text-[11px] text-slate-500 uppercase tracking-wide font-semibold mb-1">
                  {label}
                </p>
                <p className="text-[14px] font-bold text-slate-800 dark:text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Submitted by */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-3">
              Submitted By
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-royal-700 text-white flex items-center justify-center font-bold text-sm uppercase overflow-hidden">
                {listing.user?.profilePic ? (
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

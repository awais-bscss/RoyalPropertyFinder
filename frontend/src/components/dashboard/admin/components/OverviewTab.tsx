"use client";

import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  XCircle,
} from "lucide-react";
import { LISTING_STATUS, timeAgo } from "../types";
import type { Listing, ListingStats, PlatformStats } from "../types";

interface Props {
  listingStats: ListingStats | null;
  platformStats: PlatformStats | null;
  recentListings: Listing[];
  onViewAllListings: () => void;
  onViewAllUsers: () => void;
}

export function OverviewTab({
  listingStats,
  platformStats,
  recentListings,
  onViewAllListings,
  onViewAllUsers,
}: Props) {
  const cards = [
    {
      label: "Total Users",
      value: platformStats?.totalUsers ?? 0,
      icon: Users,
      iconBg: "bg-blue-600",
    },
    {
      label: "New This Month",
      value: platformStats?.newUsersThisMonth ?? 0,
      icon: Activity,
      iconBg: "bg-purple-600",
    },
    {
      label: "Pending Listings",
      value: listingStats?.pending ?? 0,
      icon: Clock,
      iconBg: "bg-amber-500",
    },
    {
      label: "Approved Listings",
      value: listingStats?.approved ?? 0,
      icon: CheckCircle2,
      iconBg: "bg-emerald-600",
    },
    {
      label: "Rejected Listings",
      value: listingStats?.rejected ?? 0,
      icon: XCircle,
      iconBg: "bg-rose-500",
    },
    {
      label: "Total Listings",
      value: listingStats?.total ?? 0,
      icon: Building2,
      iconBg: "bg-royal-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 px-5 py-3 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-sm flex items-center justify-center text-white ${s.iconBg} shrink-0`}
            >
              <s.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[26px] font-bold text-slate-900 dark:text-white leading-none">
                {s.value}
              </p>
              <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 mt-1">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending listings needing attention */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
              Needs Review
            </h3>
            {(listingStats?.pending ?? 0) > 0 && (
              <span className="bg-amber-100 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {listingStats?.pending} pending
              </span>
            )}
          </div>
          <button
            onClick={onViewAllListings}
            className="text-[12px] font-semibold text-royal-600 hover:text-royal-700 cursor-pointer flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentListings.filter((l) => l.status === "pending").slice(0, 5)
            .length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
              <CheckCircle2 className="w-8 h-8 opacity-30" />
              <p className="text-[13px] font-medium">
                All caught up! No pending listings.
              </p>
            </div>
          ) : (
            recentListings
              .filter((l) => l.status === "pending")
              .slice(0, 5)
              .map((listing) => {
                const sc = LISTING_STATUS[listing.status];
                return (
                  <div
                    key={listing._id}
                    className="p-4 flex items-center gap-3"
                  >
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                      {listing.images?.[0] ? (
                        <img
                          src={listing.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[13px] text-slate-900 dark:text-white truncate">
                        {listing.title}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.city} · {timeAgo(listing.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${sc.cls}`}
                    >
                      <sc.icon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}

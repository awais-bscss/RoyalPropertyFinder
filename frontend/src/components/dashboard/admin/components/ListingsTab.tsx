"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Eye,
  Loader2,
  MapPin,
  Search,
  XCircle,
  Crown,
} from "lucide-react";
import { LISTING_STATUS, timeAgo } from "../types";
import { formatPrice } from "@/lib/utils";
import type { Listing } from "../types";
import { ListingDrawer } from "./ListingDrawer";
import { RejectModal } from "./RejectModal";
import { TableSkeleton } from "@/components/ui/skeleton";

interface Props {
  listings: Listing[];
  loading: boolean;
  actionLoading: string | null;
  onApprove: (listing: Listing) => void;
  onReject: (listing: Listing, reason: string) => void;
  onToggleRoyalProject: (listing: Listing) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
}

export function ListingsTab({
  listings,
  loading,
  actionLoading,
  onApprove,
  onReject,
  onToggleRoyalProject,
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
}: Props) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Listing | null>(null);

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.user?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-royal-400"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-4 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <TableSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <Building2 className="w-10 h-10 opacity-40" />
            <p className="font-semibold">No listings found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((listing) => {
              const sc = LISTING_STATUS[listing.status];
              const acting = actionLoading === listing._id;
              return (
                <div
                  key={listing._id}
                  className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {listing.images?.[0] ? (
                      <img
                        src={listing.images[0]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[14px] text-slate-900 dark:text-white truncate">
                      {listing.title}
                    </p>
                    <p className="text-[12px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {listing.city}, {listing.province}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${sc.cls}`}
                      >
                        <sc.icon className="w-3 h-3" />
                        {sc.label}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {timeAgo(listing.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:block text-right shrink-0">
                    <p className="font-black text-[15px] text-slate-900 dark:text-white">
                      {formatPrice(listing.currency, listing.price)}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      {listing.user?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {listing.status === "pending" && (
                      <>
                        <button
                          onClick={() => onApprove(listing)}
                          disabled={acting}
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 cursor-pointer disabled:opacity-50"
                          title="Approve"
                        >
                          {acting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setRejectTarget(listing)}
                          disabled={acting}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {listing.status === "approved" && (
                      <button
                        onClick={() => onToggleRoyalProject(listing)}
                        disabled={acting}
                        className={`p-2 rounded-xl cursor-pointer disabled:opacity-50 transition-colors ${
                          listing.isRoyalProject
                            ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                            : "bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-500"
                        }`}
                        title={
                          listing.isRoyalProject
                            ? "Remove from Royal Projects"
                            : "Mark as Royal Project"
                        }
                      >
                        {acting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Crown
                            className="w-4 h-4"
                            fill={
                              listing.isRoyalProject ? "currentColor" : "none"
                            }
                          />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedListing && (
        <ListingDrawer
          listing={selectedListing}
          actionLoading={actionLoading === selectedListing._id}
          onApprove={() => {
            onApprove(selectedListing);
            setSelectedListing(null);
          }}
          onReject={() => {
            setRejectTarget(selectedListing);
            setSelectedListing(null);
          }}
          onClose={() => setSelectedListing(null)}
        />
      )}
      {rejectTarget && (
        <RejectModal
          listing={rejectTarget}
          onConfirm={(r) => {
            onReject(rejectTarget, r);
            setRejectTarget(null);
          }}
          onCancel={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}

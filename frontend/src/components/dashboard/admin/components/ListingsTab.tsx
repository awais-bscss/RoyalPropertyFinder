"use client";

import { useState, useRef, useEffect } from "react";
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
  Mail,
  Phone,
  Calendar,
  MoreVertical,
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.user?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, city or owner name…"
            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-royal-400 placeholder:text-slate-400"
          />
        </div>
        <div className="relative shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-4 pr-8 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Count Badge */}
        <div className="shrink-0 text-[12px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
          {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800">
        {loading ? (
          <TableSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <Building2 className="w-10 h-10 opacity-40" />
            <p className="font-semibold text-[14px]">No listings found</p>
            <p className="text-[12px] text-slate-400">Try changing the search or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              {/* ── Table Head ── */}
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[35%]">
                    Property
                  </th>
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[20%]">
                    Listed By
                  </th>
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden md:table-cell w-[15%]">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden lg:table-cell w-[10%]">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden lg:table-cell w-[10%]">
                    Date
                  </th>
                  <th className="text-center px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[10%]">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* ── Table Body ── */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((listing, rowIndex) => {
                  const dropUp = rowIndex >= filtered.length - 2;
                  const sc = LISTING_STATUS[listing.status];
                  const acting = actionLoading === listing._id;

                  return (
                    <tr
                      key={listing._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* ── Property Column ── */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="w-12 h-12 rounded-sm overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                            {listing.images?.[0] && listing.images[0].trim() !== "" ? (
                              <img
                                src={listing.images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                          </div>
                          {/* Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              {listing.isRoyalProject && (
                                <Crown className="w-3 h-3 text-amber-500 shrink-0" fill="currentColor" />
                              )}
                              <p className="font-bold text-[13.5px] text-slate-900 dark:text-white truncate max-w-[220px]">
                                {listing.title}
                              </p>
                            </div>
                            <p className="text-[11.5px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                              {listing.city}, {listing.province}
                            </p>
                            {/* Mobile-only status badge */}
                            <span className={`lg:hidden inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.cls}`}>
                              <sc.icon className="w-2.5 h-2.5" />
                              {sc.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ── Listed By Column ── */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {/* Avatar */}
                          <div className="w-8 h-8 rounded-full bg-royal-100 dark:bg-royal-900/30 text-royal-700 flex items-center justify-center font-black text-[10px] shrink-0 border border-royal-200/60 overflow-hidden">
                            {listing.user?.profilePic ? (
                              <img
                                src={listing.user.profilePic}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (listing.user?.name?.slice(0, 2) || "??").toUpperCase()
                            )}
                          </div>
                          {/* Name + Email */}
                          <div className="min-w-0">
                            <p className="font-bold text-[13px] text-slate-800 dark:text-slate-200 truncate">
                              {listing.user?.name || "Unknown"}
                            </p>
                            <div className="mt-0.5 space-y-0.5">
                              {listing.user?.email && (
                                <a
                                  href={`mailto:${listing.user.email}`}
                                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-royal-600 transition-colors truncate group-hover:underline"
                                  title={listing.user.email}
                                >
                                  <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                                  <span className="truncate max-w-[140px]">{listing.user.email}</span>
                                </a>
                              )}
                              {listing.user?.phone && (
                                <a
                                  href={`tel:${listing.user.phone}`}
                                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-600 transition-colors"
                                >
                                  <Phone className="w-3 h-3 shrink-0 text-slate-400" />
                                  {listing.user.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ── Price Column ── */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="font-black text-[14px] text-royal-600 dark:text-royal-400">
                          {formatPrice(listing.currency, listing.price)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{listing.currency}</p>
                      </td>

                      {/* ── Status Column ── */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${sc.cls}`}>
                          <sc.icon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </td>

                      {/* ── Date Column ── */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {timeAgo(listing.createdAt)}
                        </div>
                      </td>

                      {/* ── Actions Column ── */}
                      <td className="px-4 py-3">
                        <div className="relative flex justify-center" ref={openMenuId === listing._id ? menuRef : undefined}>
                          {/* 3-dot trigger */}
                          <button
                            onClick={() => setOpenMenuId(openMenuId === listing._id ? null : listing._id)}
                            className="p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
                            title="Actions"
                          >
                            {acting ? (
                              <Loader2 className="w-4 h-4 animate-spin text-royal-500" />
                            ) : (
                              <MoreVertical className="w-4 h-4" />
                            )}
                          </button>

                          {/* Dropdown */}
                          {openMenuId === listing._id && (
                            <div className={`absolute right-0 z-50 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm shadow-lg shadow-slate-200/60 dark:shadow-slate-900/80 overflow-hidden animate-in fade-in duration-150 ${dropUp ? 'bottom-8 slide-in-from-bottom-1' : 'top-8 slide-in-from-top-1'}`}>
                              {/* View Details */}
                              <button
                                onClick={() => { setSelectedListing(listing); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                View Details
                              </button>

                              {/* Approve (pending only) */}
                              {listing.status === "pending" && (
                                <button
                                  onClick={() => { onApprove(listing); setOpenMenuId(null); }}
                                  disabled={acting}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer text-left disabled:opacity-50"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Approve Listing
                                </button>
                              )}

                              {/* Reject (pending only) */}
                              {listing.status === "pending" && (
                                <button
                                  onClick={() => { setRejectTarget(listing); setOpenMenuId(null); }}
                                  disabled={acting}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer text-left disabled:opacity-50"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Reject Listing
                                </button>
                              )}

                              {/* Royal Project Toggle (approved only) */}
                              {listing.status === "approved" && (
                                <>
                                  <div className="border-t border-slate-100 dark:border-slate-800" />
                                  <button
                                    onClick={() => { onToggleRoyalProject(listing); setOpenMenuId(null); }}
                                    disabled={acting}
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors cursor-pointer text-left disabled:opacity-50"
                                  >
                                    <Crown className="w-3.5 h-3.5" fill={listing.isRoyalProject ? "currentColor" : "none"} />
                                    {listing.isRoyalProject ? "Remove Royal Tag" : "Mark as Royal Project"}
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
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

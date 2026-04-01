"use client";

import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/axios";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  MapPin,
  Eye,
  User,
  RefreshCcw,
  Loader2,
  Search,
  ChevronDown,
  X,
  Users,
  LayoutDashboard,
  ShieldCheck,
  ShieldX,
  UserCog,
  Trash2,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Calendar,
  MoreVertical,
  Mail,
  Phone,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Listing {
  _id: string;
  title: string;
  city: string;
  province: string;
  location: string;
  price: number;
  currency: string;
  purpose: string;
  subtype: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  images: string[];
  user: { name: string; email: string; profilePic?: string; phone?: string };
  createdAt: string;
  bedrooms?: string;
  bathrooms?: string;
  areaSize: number;
  areaUnit: string;
}
interface ListingStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
interface UserRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "agent";
  authProvider: string;
  profilePic?: string;
  createdAt: string;
  listingCount: number;
}
interface PlatformStats {
  totalUsers: number;
  totalAdmins: number;
  totalAgents: number;
  newUsersThisMonth: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function formatPrice(currency: string, amount: number) {
  const arab = 1_000_000_000,
    crore = 10_000_000,
    lakh = 100_000;
  const v =
    amount >= arab
      ? `${(amount / arab).toFixed(1)} Arab`
      : amount >= crore
        ? `${(amount / crore).toFixed(1)} Crore`
        : amount >= lakh
          ? `${(amount / lakh).toFixed(1)} Lakh`
          : amount.toLocaleString();
  return `${currency} ${v}`;
}
function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function fmtDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const LISTING_STATUS = {
  pending: {
    label: "Pending",
    icon: Clock,
    cls: "bg-amber-50   text-amber-700  border-amber-200  dark:bg-amber-500/10  dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    cls: "bg-rose-50    text-rose-700   border-rose-200   dark:bg-rose-500/10   dark:text-rose-400",
  },
};
const ROLE_CONFIG = {
  user: {
    label: "User",
    cls: "bg-slate-100  text-slate-700  dark:bg-slate-700  dark:text-slate-200",
    icon: User,
  },
  agent: {
    label: "Agent",
    cls: "bg-blue-50    text-blue-700   dark:bg-blue-500/10 dark:text-blue-400",
    icon: UserCog,
  },
  admin: {
    label: "Admin",
    cls: "bg-royal-50   text-royal-700  dark:bg-royal-500/10 dark:text-royal-400",
    icon: ShieldCheck,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Reject Modal
// ─────────────────────────────────────────────────────────────────────────────
function RejectModal({
  listing,
  onConfirm,
  onCancel,
}: {
  listing: Listing;
  onConfirm: (r: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  const presets = [
    "Complete property information is missing",
    "Images are low quality or misleading",
    "Price is unrealistic for this area",
    "Duplicate listing already exists",
    "Potentially fraudulent information",
    "Violates platform listing policies",
  ];
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ zIndex: 200 }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-800">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Reject Listing
              </h3>
              <p className="text-[12px] text-slate-500">{listing.title}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setReason(p)}
                className={`text-[12px] px-3 py-1.5 rounded-full border cursor-pointer transition-all ${reason === p ? "bg-rose-600 text-white border-rose-600" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-rose-300 hover:text-rose-600"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Custom reason..."
            className="w-full text-[13px] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-400 resize-none"
          />
        </div>
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm(reason || "Did not meet listing standards.")
            }
            className="px-5 py-2.5 rounded-xl text-[13px] font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Listing Drawer
// ─────────────────────────────────────────────────────────────────────────────
function ListingDrawer({
  listing,
  onApprove,
  onReject,
  onClose,
  actionLoading,
}: {
  listing: Listing;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  actionLoading: boolean;
}) {
  const sc = LISTING_STATUS[listing.status];
  return (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex: 100 }}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl overflow-y-auto">
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

// ─────────────────────────────────────────────────────────────────────────────
// Delete Confirm Modal
// ─────────────────────────────────────────────────────────────────────────────
function DeleteUserModal({
  user,
  onConfirm,
  onCancel,
}: {
  user: UserRecord;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      style={{ zIndex: 200 }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-[16px]">
              Delete User Account
            </h3>
            <p className="text-[13px] text-slate-500 mt-0.5">
              This will permanently delete <strong>{user.name}</strong> and all
              their listings.
            </p>
          </div>
        </div>
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl p-3 mb-5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <p className="text-[12px] text-rose-700 dark:text-rose-400 font-medium">
              This action cannot be undone. All property listings, data, and
              account information will be permanently erased.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Overview Tab
// ─────────────────────────────────────────────────────────────────────────────
function OverviewTab({
  listingStats,
  platformStats,
  recentListings,
  onViewAllListings,
  onViewAllUsers,
}: {
  listingStats: ListingStats | null;
  platformStats: PlatformStats | null;
  recentListings: Listing[];
  onViewAllListings: () => void;
  onViewAllUsers: () => void;
}) {
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

// ─────────────────────────────────────────────────────────────────────────────
// Listings Tab
// ─────────────────────────────────────────────────────────────────────────────
function ListingsTab({
  listings,
  loading,
  actionLoading,
  onApprove,
  onReject,
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
}: any) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Listing | null>(null);

  const filtered = listings.filter(
    (l: Listing) =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.user?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-3">
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-royal-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <Building2 className="w-10 h-10 opacity-40" />
            <p className="font-semibold">No listings found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((listing: Listing) => {
              const sc = LISTING_STATUS[listing.status];
              const acting = actionLoading === listing._id;
              return (
                <div
                  key={listing._id}
                  className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {listing.images?.[0] ? (
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

// ─────────────────────────────────────────────────────────────────────────────
// Users Tab
// ─────────────────────────────────────────────────────────────────────────────
function UsersTab({
  users,
  loading,
  onRoleChange,
  onDelete,
  roleFilter,
  setRoleFilter,
  userSearch,
  setUserSearch,
}: any) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);

  const filtered = users.filter(
    (u: UserRecord) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-royal-400"
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-4 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="agent">Agents</option>
            <option value="admin">Admins</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-royal-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <Users className="w-10 h-10 opacity-40" />
            <p className="font-semibold">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((user: UserRecord) => {
              const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;
              return (
                <div
                  key={user._id}
                  className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-royal-700 text-white flex items-center justify-center font-bold text-sm uppercase overflow-hidden shrink-0">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.[0]
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[14px] text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${rc.cls}`}
                      >
                        <rc.icon className="w-3 h-3" />
                        {rc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[12px] text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      {user.phone && (
                        <span className="text-[12px] text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-4 shrink-0">
                    <div className="text-center">
                      <p className="text-[16px] font-black text-slate-900 dark:text-white">
                        {user.listingCount}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                        Listings
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">
                        {fmtDate(user.createdAt)}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                        Joined
                      </p>
                    </div>
                  </div>

                  {/* Action menu */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === user._id ? null : user._id)
                      }
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === user._id && (
                      <div
                        className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden"
                        style={{ zIndex: 50 }}
                      >
                        <div className="p-1.5 space-y-0.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1">
                            Change Role
                          </p>
                          {(["user", "agent", "admin"] as const)
                            .filter((r) => r !== user.role)
                            .map((role) => (
                              <button
                                key={role}
                                onClick={() => {
                                  onRoleChange(user, role);
                                  setOpenMenu(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors capitalize"
                              >
                                {role === "user" && (
                                  <User className="w-3.5 h-3.5" />
                                )}
                                {role === "agent" && (
                                  <UserCog className="w-3.5 h-3.5" />
                                )}
                                {role === "admin" && (
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                )}{" "}
                                Make{" "}
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </button>
                            ))}
                          <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                          <button
                            onClick={() => {
                              setDeleteTarget(user);
                              setOpenMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete User
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onConfirm={() => {
            onDelete(deleteTarget);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {openMenu && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 40 }}
          onClick={() => setOpenMenu(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AdminListings Component
// ─────────────────────────────────────────────────────────────────────────────
export function AdminListings() {
  const [tab, setTab] = useState<"overview" | "listings" | "users">("overview");

  // Listings state
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingStats, setListingStats] = useState<ListingStats | null>(null);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Users state
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(
    null,
  );
  const [usersLoading, setUsersLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  // ── Fetch listings ──────────────────────────────────────────────────────────
  const fetchListings = useCallback(async () => {
    setListingsLoading(true);
    try {
      const [listingsRes, statsRes] = await Promise.all([
        apiClient.get(
          `/listings/admin/all${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
        ),
        apiClient.get("/listings/admin/stats"),
      ]);
      setListings(Array.isArray(listingsRes.data) ? listingsRes.data : []);
      setListingStats(statsRes.data || null);
    } catch {
      toast.error("Failed to load listings");
    } finally {
      setListingsLoading(false);
    }
  }, [statusFilter]);

  // ── Fetch users ─────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        apiClient.get(
          `/users/admin/all${roleFilter !== "all" ? `?role=${roleFilter}` : ""}`,
        ),
        apiClient.get("/users/admin/platform-stats"),
      ]);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setPlatformStats(statsRes.data || null);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Listing actions ─────────────────────────────────────────────────────────
  const handleApprove = async (listing: Listing) => {
    setActionLoading(listing._id);
    try {
      await apiClient.patch(`/listings/admin/${listing._id}/approve`);
      toast.success(`"${listing.title}" approved!`);
      fetchListings();
    } catch {
      toast.error("Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (listing: Listing, reason: string) => {
    setActionLoading(listing._id);
    try {
      await apiClient.patch(`/listings/admin/${listing._id}/reject`, {
        reason,
      });
      toast.success("Listing rejected");
      fetchListings();
    } catch {
      toast.error("Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  // ── User actions ────────────────────────────────────────────────────────────
  const handleRoleChange = async (user: UserRecord, role: string) => {
    try {
      await apiClient.patch(`/users/admin/${user._id}/role`, { role });
      toast.success(`${user.name} is now a ${role}`);
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (user: UserRecord) => {
    try {
      await apiClient.delete(`/users/admin/${user._id}`);
      toast.success(`${user.name} has been deleted`);
      fetchUsers();
      fetchListings(); // refresh listing counts too
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleRefresh = () => {
    fetchListings();
    fetchUsers();
    toast.success("Refreshed!");
  };

  // ── Tabs ────────────────────────────────────────────────────────────────────
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: "listings",
      label: "Listings",
      icon: Building2,
      badge: listingStats?.pending,
    },
    { id: "users", label: "Users", icon: Users, badge: undefined },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-royal-600" />
            Admin Panel
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            Manage listings, users and platform settings
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${tab === t.id ? "bg-white dark:bg-slate-900 text-royal-700 dark:text-royal-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            {t.badge ? (
              <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <OverviewTab
          listingStats={listingStats}
          platformStats={platformStats}
          recentListings={listings}
          onViewAllListings={() => setTab("listings")}
          onViewAllUsers={() => setTab("users")}
        />
      )}
      {tab === "listings" && (
        <ListingsTab
          listings={listings}
          loading={listingsLoading}
          actionLoading={actionLoading}
          onApprove={handleApprove}
          onReject={handleReject}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          search={search}
          setSearch={setSearch}
        />
      )}
      {tab === "users" && (
        <UsersTab
          users={users}
          loading={usersLoading}
          onRoleChange={handleRoleChange}
          onDelete={handleDeleteUser}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
        />
      )}
    </div>
  );
}

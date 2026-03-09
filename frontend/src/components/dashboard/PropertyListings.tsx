"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import {
  PlusSquare,
  Search,
  Building2,
  MapPin,
  Eye,
  Heart,
  Star,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
/**
 * Format a price using the Pakistani numbering system:
 *   ≥ 1 Arab  (1,000,000,000)  → "X Arab"
 *   ≥ 1 Crore    (10,000,000)  → "X Crore"
 *   ≥ 1 Lakh        (100,000)  → "X Lakh"
 *   < 1 Lakh                  → plain toLocaleString
 */
function formatPKR(currency: string, amount: number): string {
  const arab = 1_000_000_000;
  const crore = 10_000_000;
  const lakh = 100_000;

  let value: string;
  if (amount >= arab)
    value = `${(amount / arab).toFixed(2).replace(/\.?0+$/, "")} Arab`;
  else if (amount >= crore)
    value = `${(amount / crore).toFixed(2).replace(/\.?0+$/, "")} Crore`;
  else if (amount >= lakh)
    value = `${(amount / lakh).toFixed(2).replace(/\.?0+$/, "")} Lakh`;
  else value = amount.toLocaleString();

  return `${currency} ${value}`;
}

// ── Config ────────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; icon: any; cls: string }> =
  {
    approved: {
      label: "Approved",
      icon: CheckCircle2,
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    },
    pending: {
      label: "Pending Review",
      icon: Clock,
      cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    },
    rejected: {
      label: "Rejected",
      icon: XCircle,
      cls: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    },
    // Legacy fallback
    Active: {
      label: "Active",
      icon: CheckCircle2,
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    },
    Pending: {
      label: "Pending",
      icon: Clock,
      cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    },
    Expired: {
      label: "Expired",
      icon: XCircle,
      cls: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    },
  };

const PAGE_SIZE = 5;

export function PropertyListings() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const response: any = await apiClient.get("/listings/me/properties");
        // Map backend format to component's expected format
        const formatted = (response?.data || []).map((l: any) => ({
          id: l._id,
          title: l.title,
          city: l.city,
          area: l.location,
          price: formatPKR(l.currency, l.price),
          type: l.purpose, // "Sell" or "Rent"
          category: l.subtype,
          status: l.status || (l.isActive ? "approved" : "rejected"),
          rejectionReason: l.rejectionReason,
          views: l.views || Math.floor(Math.random() * 500) + 50, // Mocked for now
          saves: l.saves || Math.floor(Math.random() * 50) + 5,
          rating: l.rating || (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
          postedDate: new Date(l.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        }));
        setListings(formatted);
      } catch (error) {
        console.error("Failed to fetch manage listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  // ── Delete Handler ────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await apiClient.delete(`/listings/${id}`);
      setListings((prev) => prev.filter((l) => l.id !== id));
      toast.success("Listing deleted successfully");
    } catch (err: any) {
      // Toast is already shown by the axios interceptor
      console.error("Delete listing error:", err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filtered = listings.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.area.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchType =
      typeFilter === "All" ||
      l.type === typeFilter ||
      (typeFilter === "Sale" && l.type === "Sell");
    return matchSearch && matchStatus && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetPage = () => setPage(1);

  // ── Summary stats ─────────────────────────────────────────────────────────
  const totalActive = listings.filter((l) => l.status === "Active").length;
  const totalPending = listings.filter((l) => l.status === "Pending").length;
  const totalExpired = listings.filter((l) => l.status === "Expired").length;
  const totalViews = listings.reduce((a, l) => a + l.views, 0).toLocaleString();

  const summaryCards = [
    {
      label: "Total Listings",
      value: listings.length,
      icon: Building2,
      iconBg: "bg-royal-600",
      sub: "All properties",
    },
    {
      label: "Active",
      value: totalActive,
      icon: CheckCircle2,
      iconBg: "bg-emerald-600",
      sub: "Live on market",
    },
    {
      label: "Pending",
      value: totalPending,
      icon: Clock,
      iconBg: "bg-amber-500",
      sub: "Awaiting approval",
    },
    {
      label: "Total Views",
      value: totalViews,
      icon: TrendingUp,
      iconBg: "bg-violet-600",
      sub: "Across all listings",
    },
  ];

  return (
    <div className="space-y-5">
      {/* ── Page Title Row ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-slate-900 dark:text-white">
            All Listings
          </h2>
          <p className="text-[14px] text-slate-600 dark:text-slate-400 mt-0.5">
            Manage and track all your posted properties
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/post-listing")}
          className="flex items-center gap-2 px-4 py-2 bg-royal-600 hover:bg-royal-700 text-white text-[14px] font-bold rounded-sm transition-colors cursor-pointer"
        >
          <PlusSquare className="w-4 h-4" />
          Post New Listing
        </button>
      </div>

      {/* ── Summary Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-sm flex items-center justify-center text-white ${c.iconBg} shrink-0`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[26px] font-bold text-slate-900 dark:text-white leading-none">
                  {c.value}
                </p>
                <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 mt-1">
                  {c.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Listings Table Card ────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800">
          {/* Search */}
          <div className="relative flex-1 min-w-0 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Search listings..."
              className="w-full pl-9 pr-3 py-2 text-[14px] font-medium border border-slate-200 dark:border-slate-700 rounded-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-royal-400 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                resetPage();
              }}
              className="text-[14px] font-medium border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-royal-400 cursor-pointer"
            >
              {[
                { label: "All", value: "All" },
                { label: "Approved", value: "approved" },
                { label: "Pending Review", value: "pending" },
                { label: "Rejected", value: "rejected" },
              ].map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {/* Type */}
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                resetPage();
              }}
              className="text-[14px] font-medium border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-royal-400 cursor-pointer"
            >
              {["All", "Sale", "Rent"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                {[
                  "Property",
                  "City / Area",
                  "Price",
                  "Type",
                  "Stats",
                  "Status",
                  "Posted",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[13px] font-extrabold uppercase tracking-wider text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Building2 className="w-10 h-10 opacity-20" />
                      <p className="text-sm font-medium">No listings found</p>
                      <p className="text-[12px]">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((l) => {
                  const sc = statusConfig[l.status];
                  const StatusIcon = sc.icon;
                  return (
                    <tr
                      key={l.id}
                      className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Property */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-sm bg-royal-50 dark:bg-royal-900/30 border border-royal-100 dark:border-royal-800/40 flex items-center justify-center shrink-0">
                            <Building2 className="w-4 h-4 text-royal-600 dark:text-royal-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                              {l.title}
                            </p>
                            <p className="text-[13px] font-medium text-slate-500 mt-1">
                              {l.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-4 py-3.5 max-w-[140px]">
                        <div className="flex items-center gap-1.5 text-[14px] font-medium text-slate-600 truncate">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span className="truncate">{l.city}</span>
                        </div>
                        <p
                          className="text-[13px] text-slate-500 ml-5 mt-1 truncate"
                          title={l.area}
                        >
                          {l.area}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[15px] font-extrabold text-royal-700 dark:text-royal-400">
                          {l.price}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[12px] font-bold px-2.5 py-1 rounded-sm border ${
                            l.type === "Rent"
                              ? "bg-violet-50 text-violet-800 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20"
                              : "bg-royal-50 text-royal-800 border-royal-200 dark:bg-royal-500/10 dark:text-royal-400 dark:border-royal-500/20"
                          }`}
                        >
                          {l.type === "Sell" ? "Sale" : l.type}
                        </span>
                      </td>

                      {/* Stats */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3 text-[13px] font-medium text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            {l.views}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Heart className="w-4 h-4" />
                            {l.saves}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            {l.rating}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-sm border ${sc.cls}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {sc.label}
                        </span>
                      </td>

                      {/* Posted */}
                      <td className="px-4 py-3.5 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                        {l.postedDate}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              router.push(`/dashboard/edit-listing/${l.id}`)
                            }
                            className="p-1.5 rounded-sm hover:bg-royal-50 dark:hover:bg-royal-500/10 text-slate-400 hover:text-royal-600 transition-colors cursor-pointer"
                            title="Edit listing"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(l.id)}
                            disabled={deletingId === l.id}
                            className="p-1.5 rounded-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === l.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[14px] text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
              {Math.min(page * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {filtered.length}
            </span>{" "}
            listings
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-sm border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 text-[14px] font-bold rounded-sm border transition-colors cursor-pointer ${
                  page === p
                    ? "bg-royal-600 text-white border-royal-600"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 hover:border-royal-300 hover:text-royal-600"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-sm border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Dialog ─────────────────────────────── */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 shadow-2xl p-6 w-full max-w-sm mx-4"
            style={{ animation: "rpf-modal-in 0.18s cubic-bezier(.4,0,.2,1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
            </div>

            {/* Text */}
            <h3 className="text-[16px] font-bold text-slate-900 dark:text-white text-center mb-1">
              Delete Listing?
            </h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 text-center mb-6">
              This action cannot be undone. The listing will be permanently
              removed.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 text-[14px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={!!deletingId}
                className="flex-1 py-2.5 text-[14px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-sm transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  Camera,
  Box,
  PenLine,
  Share2,
  LayoutList,
  Search,
  ChevronRight,
  ChevronLeft,
  ReceiptText,
  Download,
  ShoppingBag,
  TrendingUp,
  X,
  SlidersHorizontal,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = "Completed" | "Processing" | "Cancelled";

interface Order {
  id: string;
  item: string;
  desc: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  date: string;
  amount: number;
  qty: number;
  status: Status;
  paymentMethod: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const orders: Order[] = [
  {
    id: "ORD-2026-001",
    item: "Featured Listing Boost",
    desc: "30-day premium placement on search results",
    icon: Zap,
    iconBg: "bg-rose-50 dark:bg-rose-500/10",
    iconColor: "text-rose-500 dark:text-rose-400",
    date: "Feb 20, 2026",
    amount: 5500,
    qty: 1,
    status: "Completed",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-2026-002",
    item: "3D Virtual Tour Creation",
    desc: "Immersive 3D walkthrough for your property",
    icon: Box,
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconColor: "text-violet-500 dark:text-violet-400",
    date: "Feb 18, 2026",
    amount: 25000,
    qty: 1,
    status: "Processing",
    paymentMethod: "JazzCash",
  },
  {
    id: "ORD-2026-003",
    item: "Professional Photography",
    desc: "High-quality photo shoot for your property",
    icon: Camera,
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconColor: "text-amber-500 dark:text-amber-400",
    date: "Feb 10, 2026",
    amount: 12000,
    qty: 2,
    status: "Completed",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "ORD-2026-004",
    item: "Floor Plan Design",
    desc: "Professional 2D/3D floor plan blueprint",
    icon: PenLine,
    iconBg: "bg-sky-50 dark:bg-sky-500/10",
    iconColor: "text-sky-500 dark:text-sky-400",
    date: "Feb 05, 2026",
    amount: 8000,
    qty: 1,
    status: "Completed",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-2026-005",
    item: "Social Media Promotion",
    desc: "7-day social media ad campaign for your listing",
    icon: Share2,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    date: "Jan 28, 2026",
    amount: 18000,
    qty: 1,
    status: "Cancelled",
    paymentMethod: "EasyPaisa",
  },
  {
    id: "ORD-2026-006",
    item: "Property Description Copy",
    desc: "SEO-optimised listing copy written by experts",
    icon: LayoutList,
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-500 dark:text-slate-400",
    date: "Jan 20, 2026",
    amount: 3500,
    qty: 3,
    status: "Completed",
    paymentMethod: "Credit Card",
  },
];

// ── Status config ─────────────────────────────────────────────────────────────
const statusConfig: Record<Status, { label: string; icon: any; cls: string }> =
  {
    Completed: {
      label: "Completed",
      icon: CheckCircle2,
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    },
    Processing: {
      label: "Processing",
      icon: Clock,
      cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    },
    Cancelled: {
      label: "Cancelled",
      icon: XCircle,
      cls: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    },
  };

const PAGE_SIZE = 5;

const totalSpent = orders
  .filter((o) => o.status !== "Cancelled")
  .reduce((s, o) => s + o.amount * o.qty, 0);

// ── Main Component ────────────────────────────────────────────────────────────
export function OrderHistory({
  setActiveTab,
}: {
  setActiveTab?: (tab: string) => void;
}) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchFilter = statusFilter === "All" || o.status === statusFilter;
    const matchSearch =
      o.item.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const resetPage = () => setPage(1);

  // ── Summary stats ─────────────────────────────────────────────────────────
  const summaryCards = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: Package,
      iconBg: "bg-royal-600",
    },
    {
      label: "Completed",
      value: orders.filter((o) => o.status === "Completed").length,
      icon: CheckCircle2,
      iconBg: "bg-emerald-600",
    },
    {
      label: "Processing",
      value: orders.filter((o) => o.status === "Processing").length,
      icon: Clock,
      iconBg: "bg-amber-500",
    },
    {
      label: "Total Spent",
      value: `PKR ${(totalSpent / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      iconBg: "bg-violet-600",
    },
  ];

  return (
    <div className="space-y-5">
      {/* ── Summary Cards ──────────────────────────────────────────────── */}
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
                <Icon className="w-4 h-4" />
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

      {/* ── Orders Table Card ───────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-5 border-b border-slate-100 dark:border-slate-800">
          {/* Title + badge */}
          <div className="flex items-center gap-2 shrink-0">
            <ReceiptText className="w-5 h-5 text-royal-600 dark:text-royal-400" />
            <p className="text-[15px] font-bold text-slate-900 dark:text-white">
              Order History
            </p>
            <span className="text-[10px] font-bold bg-royal-600 text-white px-1.5 py-0.5 rounded-full">
              {orders.length}
            </span>
          </div>

          {/* Right side: Search + Filter */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Search */}
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
                placeholder="Search orders..."
                className="w-full pl-9 pr-3 py-2 text-[14px] font-medium border border-slate-200 dark:border-slate-700 rounded-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-royal-400 transition-colors"
              />
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />

            {/* Filter group — icon sits right next to its select */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  resetPage();
                }}
                className="text-[14px] font-medium border border-slate-200 dark:border-slate-700 rounded-sm px-3 py-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-royal-400 cursor-pointer"
              >
                {["All", "Completed", "Processing", "Cancelled"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                {[
                  "Service",
                  "Order ID",
                  "Date",
                  "Amount",
                  "Payment",
                  "Status",
                  "",
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
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Package className="w-10 h-10 opacity-20" />
                      <p className="text-sm font-medium">No orders found</p>
                      <p className="text-[12px]">
                        Try adjusting your search or filter
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((order) => {
                  const sc = statusConfig[order.status];
                  const StIcon = sc.icon;
                  const ItemIcon = order.icon;
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Service */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 ${order.iconBg}`}
                          >
                            <ItemIcon
                              className={`w-4 h-4 ${order.iconColor}`}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                              {order.item}
                            </p>
                            <p className="text-[13px] font-medium text-slate-500 mt-1">
                              Qty: {order.qty}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Order ID */}
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] font-mono font-bold text-slate-500">
                          #{order.id}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5">
                        <span className="text-[14px] font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {order.date}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5">
                        <span className="text-[15px] font-extrabold text-royal-700 dark:text-royal-400">
                          PKR {(order.amount * order.qty).toLocaleString()}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3.5">
                        <span className="text-[14px] font-medium text-slate-600 dark:text-slate-400">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-sm border ${sc.cls}`}
                        >
                          <StIcon className="w-3.5 h-3.5" />
                          {sc.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelected(order)}
                            className="p-1.5 rounded-sm hover:bg-royal-50 dark:hover:bg-royal-500/10 text-slate-400 hover:text-royal-600 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            title="Download Invoice"
                          >
                            <Download className="w-4 h-4" />
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
            orders
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-sm border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
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
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Order Detail Side Panel ─────────────────────────────────────── */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          />
          <div className="fixed right-0 top-0 h-full w-[340px] z-50 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col shadow-2xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div>
                <p className="text-[16px] font-bold text-slate-900 dark:text-white">
                  Order Details
                </p>
                <p className="text-[13px] text-slate-500 font-mono mt-0.5">
                  #{selected.id}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Service card */}
              <div className="flex items-start gap-3 p-4 rounded-sm border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                <div
                  className={`w-10 h-10 rounded-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 ${selected.iconBg}`}
                >
                  <selected.icon className={`w-5 h-5 ${selected.iconColor}`} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900 dark:text-white">
                    {selected.item}
                  </p>
                  <p className="text-[13px] font-medium text-slate-500 mt-1">
                    {selected.desc}
                  </p>
                </div>
              </div>

              {/* Detail rows */}
              {[
                { label: "Order ID", value: `#${selected.id}`, mono: true },
                { label: "Date Placed", value: selected.date, mono: false },
                {
                  label: "Quantity",
                  value: `${selected.qty} unit${selected.qty > 1 ? "s" : ""}`,
                  mono: false,
                },
                {
                  label: "Unit Price",
                  value: `PKR ${selected.amount.toLocaleString()}`,
                  mono: false,
                },
                {
                  label: "Payment Method",
                  value: selected.paymentMethod,
                  mono: false,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <span className="text-[12px] text-slate-400">
                    {row.label}
                  </span>
                  <span
                    className={`text-[12.5px] font-semibold text-slate-700 dark:text-slate-200 ${row.mono ? "font-mono" : ""}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}

              {/* Total */}
              <div className="flex items-center justify-between py-3 bg-royal-50 dark:bg-royal-500/10 rounded-sm px-4 border border-royal-100 dark:border-royal-500/20">
                <span className="text-[14px] font-bold text-slate-800 dark:text-slate-200">
                  Total Paid
                </span>
                <span className="text-[16px] font-extrabold text-royal-700 dark:text-royal-400">
                  PKR {(selected.amount * selected.qty).toLocaleString()}
                </span>
              </div>

              {/* Status */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Status
                </p>
                {(() => {
                  const st = statusConfig[selected.status];
                  const StIcon = st.icon;
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-sm border ${st.cls}`}
                    >
                      <StIcon className="w-3.5 h-3.5" />
                      {st.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Panel Footer */}
            <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-[14px] font-bold py-2.5 rounded-sm transition-colors cursor-pointer">
                <Download className="w-4 h-4" /> Invoice
              </button>
              {selected.status !== "Cancelled" && (
                <button className="flex-1 flex items-center justify-center gap-2 bg-royal-600 hover:bg-royal-700 text-white text-[14px] font-bold py-2.5 rounded-sm transition-colors cursor-pointer">
                  <Package className="w-4 h-4" /> Track Order
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  MoreVertical,
  Filter,
  Package,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  User,
  ExternalLink,
  ChevronRight,
  MoreHorizontal,
  Banknote,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";

// ── MOCK DATA FOR ORDERS ──────────────────────────────────────────────────
const mockOrders = [
  {
    id: "ORD-7241",
    customer: "Ahmed Khan",
    email: "ahmed.k@gmail.com",
    service: "Featured Listing Boost",
    amount: 5500,
    status: "paid",
    date: "2026-03-09T14:30:00Z",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-7242",
    customer: "Sara Malik",
    email: "sara.m@propmaster.pk",
    service: "3D Virtual Tour",
    amount: 25000,
    status: "pending",
    date: "2026-03-09T16:45:00Z",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "ORD-7243",
    customer: "Zain Ali",
    email: "zain.agent@royal.pk",
    service: "Social Media Promotion",
    amount: 18000,
    status: "paid",
    date: "2026-03-10T09:15:00Z",
    paymentMethod: "Mobile Wallet",
  },
  {
    id: "ORD-7244",
    customer: "Omar Farooq",
    email: "omar.f@outlook.com",
    service: "Professional Photography",
    amount: 12000,
    status: "failed",
    date: "2026-03-10T11:00:00Z",
    paymentMethod: "Credit Card",
  },
];

const ORDER_STATUS = {
  paid: {
    label: "Paid",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    icon: Clock,
  },
  failed: {
    label: "Failed",
    cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    icon: XCircle,
  },
};

export function OrdersTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState(mockOrders);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const getStatusTotal = (status: string) =>
    orders.filter((o) => o.status === status).length;

  return (
    <div className="space-y-4">
      {/* ── Summary Stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: orders.length,
            icon: ShoppingCart,
            iconBg: "bg-royal-600",
          },
          {
            label: "Confirmed Revenue",
            value: `PKR ${orders
              .filter((o) => o.status === "paid")
              .reduce((acc, o) => acc + o.amount, 0)
              .toLocaleString()}`,
            icon: Banknote,
            iconBg: "bg-emerald-600",
          },
          {
            label: "Pending Sales",
            value: getStatusTotal("pending"),
            icon: Clock,
            iconBg: "bg-amber-500",
          },
          {
            label: "Avg. Order Value",
            value: `PKR ${Math.round(
              orders.reduce((acc, i) => acc + i.amount, 0) / orders.length || 0,
            ).toLocaleString()}`,
            icon: TrendingUp,
            iconBg: "bg-violet-600",
          },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-md flex items-center justify-center text-white ${c.iconBg} shrink-0`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[18px] font-bold text-slate-800 dark:text-white leading-none">
                  {c.value}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-wider">
                  {c.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-sm border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[13px] border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-royal-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Orders", count: orders.length },
            { id: "paid", label: "Paid", count: getStatusTotal("paid") },
            {
              id: "pending",
              label: "Pending",
              count: getStatusTotal("pending"),
            },
            { id: "failed", label: "Failed", count: getStatusTotal("failed") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                filter === tab.id
                  ? "bg-royal-600 text-white shadow-md shadow-royal-600/20"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  filter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-24">
                  Order ID
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Customer
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Service Item
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-12 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Package className="w-10 h-10 opacity-20" />
                      <p className="text-[14px] font-medium">No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const sc =
                    ORDER_STATUS[order.status as keyof typeof ORDER_STATUS];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-5 py-4 font-black text-slate-900 dark:text-white text-[13px]">
                        {order.id}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-royal-100 dark:bg-royal-500/10 text-royal-700 dark:text-royal-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {order.customer.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-[13.5px] truncate">
                              {order.customer}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {order.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-royal-600" />
                          <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                            {order.service}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[14px] font-black text-slate-900 dark:text-white">
                          PKR {order.amount.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          via {order.paymentMethod}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${sc.cls}`}
                        >
                          <sc.icon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {new Date(order.date).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-48 font-bold text-[12px]"
                          >
                            <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 tracking-wider">
                              Order Management
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer py-2">
                              <ExternalLink className="mr-2 h-4 w-4" /> View
                              Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer py-2">
                              <User className="mr-2 h-4 w-4" /> View Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer py-2">
                              <Mail className="mr-2 h-4 w-4" /> Email Customer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-emerald-600 focus:text-emerald-700 py-2">
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as
                              Paid
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-rose-600 focus:text-rose-700 py-2">
                              <XCircle className="mr-2 h-4 w-4" /> Refund Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

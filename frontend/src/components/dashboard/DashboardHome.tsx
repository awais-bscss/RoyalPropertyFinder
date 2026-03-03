"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  Eye,
  Heart,
  Package,
  PlusSquare,
  ShoppingBag,
  ClipboardList,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Bell,
  MapPin,
  Calendar,
  Star,
  ArrowUpRight,
  Zap,
  BarChart3,
  Activity,
} from "lucide-react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const recentActivity = [
  {
    id: 1,
    message: "Your listing in DHA Phase 6 got 12 new views",
    time: "2min ago",
    icon: Eye,
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
  },
  {
    id: 2,
    message: "Someone saved your apartment in Karachi",
    time: "27min ago",
    icon: Heart,
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  },
  {
    id: 3,
    message: "Your Props Shop order has been confirmed",
    time: "1hr ago",
    icon: Package,
    dot: "bg-amber-500",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  },
  {
    id: 4,
    message: "Listing 'Studio F-7' approved and live",
    time: "3hr ago",
    icon: Building2,
    dot: "bg-emerald-500",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  {
    id: 5,
    message: "New price drop alert in Islamabad area",
    time: "Yesterday",
    icon: Bell,
    dot: "bg-violet-500",
    badge:
      "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  },
];

const topProperties = [
  {
    id: 1,
    title: "DHA Phase 6 Apartment",
    city: "Lahore",
    price: "PKR 2.5 Cr",
    views: 841,
    saves: 34,
    rating: 4.8,
    status: "Active",
  },
  {
    id: 2,
    title: "Studio Apartment F-7",
    city: "Islamabad",
    price: "PKR 65K/mo",
    views: 620,
    saves: 22,
    rating: 4.5,
    status: "Active",
  },
  {
    id: 3,
    title: "Bahria Town Commercial",
    city: "Rawalpindi",
    price: "PKR 980 L",
    views: 312,
    saves: 11,
    rating: 4.2,
    status: "Pending",
  },
];

const stats = [
  {
    label: "My Listings",
    value: "12",
    change: "+2 this month",
    up: true,
    icon: Building2,
    iconBg: "bg-royal-600",
    iconColor: "text-white",
  },
  {
    label: "Total Views",
    value: "3.4K",
    change: "+18% this week",
    up: true,
    icon: Eye,
    iconBg: "bg-emerald-600",
    iconColor: "text-white",
  },
  {
    label: "Saved by Others",
    value: "94",
    change: "-3 this week",
    up: false,
    icon: Heart,
    iconBg: "bg-rose-500",
    iconColor: "text-white",
  },
  {
    label: "Active Orders",
    value: "3",
    change: "+1 new order",
    up: true,
    icon: Package,
    iconBg: "bg-amber-500",
    iconColor: "text-white",
  },
];

const quickActions = [
  {
    label: "Post a New Listing",
    desc: "Publish property to marketplace",
    icon: PlusSquare,
    tab: "post-listing",
    iconBg: "bg-royal-600",
    accent: "text-royal-700 dark:text-royal-300",
  },
  {
    label: "Browse Props Shop",
    desc: "Boost your listing visibility",
    icon: ShoppingBag,
    tab: "props-shop",
    iconBg: "bg-emerald-600",
    accent: "text-emerald-700 dark:text-emerald-300",
  },
  {
    label: "View Order History",
    desc: "Track your purchases & orders",
    icon: ClipboardList,
    tab: "order-history",
    iconBg: "bg-amber-500",
    accent: "text-amber-700 dark:text-amber-300",
  },
];

const marketData = [
  { city: "Karachi", trend: "+5.2%", up: true, price: "PKR 1.8 Cr avg" },
  { city: "Lahore", trend: "+3.8%", up: true, price: "PKR 2.1 Cr avg" },
  { city: "Islamabad", trend: "-1.2%", up: false, price: "PKR 2.9 Cr avg" },
  { city: "Rawalpindi", trend: "+2.1%", up: true, price: "PKR 1.2 Cr avg" },
];

// ─────────────────────────────────────────────────────────────────────────────
export function DashboardHome({ user }: { user: any }) {
  const router = useRouter();
  const firstName = user?.name?.split(" ")[0] ?? "User";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-5">
      {/* ── Welcome Banner ─────────────────────────────────────────── */}
      <div className="rounded-sm border border-slate-200 dark:border-slate-700 bg-linear-to-r from-royal-700 via-royal-800 to-slate-800 p-6 text-white overflow-hidden relative">
        <div className="pointer-events-none absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="text-royal-200 text-xs font-semibold uppercase tracking-widest mb-1">
              {greeting}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight capitalize">
              {firstName}
            </h1>
            <p className="text-royal-200/90 text-sm mt-1.5 max-w-sm">
              Here's a snapshot of your Royal Property account today.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[13px] text-royal-200/80 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date().toLocaleDateString("en-PK", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {[
              ["12", "Listings"],
              ["3.4K", "Views"],
              ["94", "Saves"],
            ].map(([v, l]) => (
              <div
                key={l}
                className="border border-white/20 rounded-sm px-4 py-3 flex flex-col items-center min-w-[72px] bg-white/5"
              >
                <span className="text-2xl font-bold">{v}</span>
                <span className="text-[12px] text-royal-200/90 font-medium mt-0.5 uppercase tracking-wide">
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 px-5 py-3 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-sm flex items-center justify-center text-white ${s.iconBg} shrink-0`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[26px] font-bold text-slate-900 dark:text-white leading-none">
                  {s.value}
                </p>
                <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 mt-1">
                  {s.label}
                </p>
                <div
                  className={`mt-1.5 flex items-center gap-1 text-[12px] font-bold ${s.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                >
                  {s.up ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  {s.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main 2-col layout ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* LEFT ── top properties + activity */}
        <div className="xl:col-span-2 space-y-4">
          {/* Top Properties */}
          <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* card header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-royal-600 dark:text-royal-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                  Top Performing Listings
                </h3>
              </div>
              <button
                onClick={() => router.push("/dashboard/property-listings")}
                className="text-[13px] font-bold text-royal-600 dark:text-royal-400 flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                View All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            {/* rows */}
            <div>
              {topProperties.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-sm bg-royal-50 dark:bg-royal-900/30 border border-royal-100 dark:border-royal-800/40 flex items-center justify-center shrink-0">
                    <Building2 className="w-4.5 h-4.5 text-royal-600 dark:text-royal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-[15px] truncate">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-[13px] font-medium text-slate-600">
                        {p.city}
                      </span>
                      <span className="text-slate-400 dark:text-slate-600">
                        ·
                      </span>
                      <span className="text-[14px] font-extrabold text-royal-700 dark:text-royal-400">
                        {p.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-2.5 text-[13px] font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> {p.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" /> {p.saves}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                          {p.rating}
                        </span>
                      </div>
                      <span
                        className={`text-[12px] font-bold px-2 py-0.5 rounded-sm border ${
                          p.status === "Active"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                            : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Activity className="w-5 h-5 text-violet-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Recent Activity
              </h3>
            </div>
            <div>
              {recentActivity.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3.5 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 border ${a.badge} border-current/20`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <p className="flex-1 text-[14px] font-medium text-slate-700 dark:text-slate-300">
                      {a.message}
                    </p>
                    <span className="text-[12px] font-medium text-slate-500 whitespace-nowrap shrink-0">
                      {a.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT ── quick actions + market snapshot */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Quick Actions
              </h3>
            </div>
            <div className="p-3 space-y-1.5">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.tab}
                    onClick={() => router.push(`/dashboard/${a.tab}`)}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer text-left group"
                  >
                    <div
                      className={`w-9 h-9 rounded-sm flex items-center justify-center text-white ${a.iconBg} shrink-0`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[14px] font-bold ${a.accent}`}>
                        {a.label}
                      </p>
                      <p className="text-[13px] font-medium text-slate-500 truncate mt-0.5">
                        {a.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-500 shrink-0 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Market Snapshot */}
          <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Market Snapshot
              </h3>
              <p className="text-[13px] font-medium text-slate-500 mt-1">
                Avg. property prices this week
              </p>
            </div>
            <div className="p-3 space-y-1">
              {marketData.map((m) => (
                <div
                  key={m.city}
                  className="flex items-center justify-between px-3 py-2.5 rounded-sm hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div>
                    <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200">
                      {m.city}
                    </p>
                    <p className="text-[13px] font-medium text-slate-500 mt-0.5">
                      {m.price}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-sm border ${
                      m.up
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                    }`}
                  >
                    {m.up ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {m.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

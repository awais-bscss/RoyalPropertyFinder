"use client";

import { useState, useEffect, useCallback } from "react";
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
  Activity,
  Loader2,
  MessageSquare,
} from "lucide-react";
import apiClient from "@/lib/axios";
import { ListingInquiryService } from "@/services/listingInquiry.service";
import { timeAgo } from "./admin/types";
import { Skeleton } from "@/components/ui/skeleton";

// ─────────────────────────────────────────────────────────────────────────────
export function DashboardHome({ user }: { user: any }) {
  const router = useRouter();
  const firstName = user?.name?.split(" ")[0] ?? "User";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [listingsRes, inquiriesRes]: any[] = await Promise.all([
        apiClient.get("/listings/me/properties"),
        ListingInquiryService.getMyInquiries(),
      ]);

      if (listingsRes.success) {
        setRecentListings(listingsRes.data.slice(0, 3));
        
        // Calculate basic stats for now
        const total = listingsRes.data.length;
        const active = listingsRes.data.filter((l: any) => l.status === 'approved').length;
        const pending = listingsRes.data.filter((l: any) => l.status === 'pending').length;
        
        setStats({
          listings: total,
          active,
          pending,
          inquiries: inquiriesRes.data?.length || 0,
          newInquiries: inquiriesRes.data?.filter((i: any) => i.status === 'unread').length || 0
        });
      }
      
      if (inquiriesRes.success) {
        setRecentInquiries(inquiriesRes.data.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
      label: "View Inbox",
      desc: "Manage property leads",
      icon: MessageSquare,
      tab: "inbox",
      iconBg: "bg-amber-500",
      accent: "text-amber-700 dark:text-amber-300",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-royal-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

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
              [stats?.listings || 0, "Listings"],
              [stats?.inquiries || 0, "Inquiries"],
              [stats?.newInquiries || 0, "New Leads"],
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
        {[
          { label: "Total Listings", value: stats?.listings || 0, icon: Building2, bg: "bg-royal-600" },
          { label: "Approved Ads", value: stats?.active || 0, icon: CheckCircle2, bg: "bg-emerald-600" },
          { label: "Pending Review", value: stats?.pending || 0, icon: Bell, bg: "bg-amber-600" },
          { label: "Received Leads", value: stats?.inquiries || 0, icon: MessageSquare, bg: "bg-indigo-600" },
        ].map((s: any) => (
          <div
            key={s.label}
            className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 px-5 py-3 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-white ${s.bg} shrink-0`}>
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

      {/* ── Main 2-col layout ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* LEFT ── top properties + activity */}
        <div className="xl:col-span-2 space-y-4">
          {/* My Recent Properties */}
          <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-royal-600 dark:text-royal-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                  My Properties
                </h3>
              </div>
              <button
                onClick={() => router.push("/dashboard/property-listings")}
                className="text-[13px] font-bold text-royal-600 dark:text-royal-400 flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                Manage All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div>
              {recentListings.length === 0 ? (
                <div className="p-10 text-center text-slate-400">
                   <p className="text-sm font-medium">You haven't posted any properties yet.</p>
                </div>
              ) : recentListings.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="w-12 h-10 rounded-sm overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-[14px] truncate">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[12px] font-medium text-slate-500 truncate">
                        {p.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] font-black text-royal-600">
                      {p.currency} {p.price.toLocaleString()}
                    </p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                      p.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Leads Activity */}
          <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Activity className="w-5 h-5 text-violet-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Latest Inquiries
              </h3>
            </div>
            <div>
              {recentInquiries.length === 0 ? (
                <div className="p-10 text-center text-slate-400">
                   <p className="text-sm font-medium">No inquiries received yet.</p>
                </div>
              ) : recentInquiries.map((a) => (
                <div
                  key={a._id}
                  className="flex items-center gap-3.5 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => router.push('/dashboard/inbox')}
                >
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 bg-royal-50 dark:bg-royal-900/30 text-royal-600 border border-royal-100`}>
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate">
                       New inquiry from {a.senderName}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">
                       Re: {a.listing?.title}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap shrink-0">
                    {timeAgo(a.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT ── quick actions + market snapshot */}
        <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

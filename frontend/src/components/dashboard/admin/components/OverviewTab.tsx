"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  XCircle,
  MessageSquare,
  BarChart3,
  PieChart as PieChartIcon,
  Crown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  LISTING_STATUS,
  timeAgo,
  ROLE_CONFIG,
  INQUIRY_TYPES,
  INQUIRY_STATUS,
} from "../types";
import type {
  Listing,
  ListingStats,
  PlatformStats,
  UserRecord,
  SupportInquiry,
  InquiryStats,
} from "../types";

interface Props {
  listingStats: ListingStats | null;
  platformStats: PlatformStats | null;
  recentListings: Listing[];
  recentUsers: UserRecord[];
  recentInquiries: SupportInquiry[];
  inquiryStats: InquiryStats | null;
  onViewAllListings: () => void;
  onViewAllUsers: () => void;
  onViewAllInquiries: () => void;
}

export function OverviewTab({
  listingStats,
  platformStats,
  recentListings,
  recentUsers,
  recentInquiries,
  inquiryStats,
  onViewAllListings,
  onViewAllUsers,
  onViewAllInquiries,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
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
    {
      label: "Open Inquiries",
      value: inquiryStats?.open ?? 0,
      icon: MessageSquare,
      iconBg: "bg-indigo-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending listings needing attention */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
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

        {/* New Recent Users Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Recent Registrations
              </h3>
            </div>
            <button
              onClick={onViewAllUsers}
              className="text-[12px] font-semibold text-royal-600 hover:text-royal-700 cursor-pointer flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentUsers.slice(0, 5).length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                <Users className="w-8 h-8 opacity-30" />
                <p className="text-[13px] font-medium">No recent users.</p>
              </div>
            ) : (
              recentUsers.slice(0, 5).map((user) => {
                const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;
                return (
                  <div key={user._id} className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-royal-700 text-white flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[13px] text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${rc.cls}`}
                      >
                        <rc.icon className="w-3 h-3" />
                        {rc.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {timeAgo(user.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Performing Agents Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Top Agents
              </h3>
            </div>
            <button
              onClick={onViewAllUsers}
              className="text-[12px] font-semibold text-royal-600 hover:text-royal-700 cursor-pointer flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentUsers
              .filter((u) => u.role === "agent" || u.role === "admin")
              .sort((a, b) => (b.listingCount || 0) - (a.listingCount || 0))
              .slice(0, 5).length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                <Crown className="w-8 h-8 opacity-30" />
                <p className="text-[13px] font-medium">No active agents.</p>
              </div>
            ) : (
              recentUsers
                .filter((u) => u.role === "agent" || u.role === "admin")
                .sort((a, b) => (b.listingCount || 0) - (a.listingCount || 0))
                .slice(0, 5)
                .map((user, idx) => {
                  return (
                    <div key={user._id} className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                        #{idx + 1}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-royal-700 text-white flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0">
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
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[13px] text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-black text-[14px] text-royal-600">
                          {user.listingCount || 0}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          Listings
                        </span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Recent Inquiries
              </h3>
            </div>
            <button
              onClick={onViewAllInquiries}
              className="text-[12px] font-semibold text-royal-600 hover:text-royal-700 cursor-pointer flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentInquiries.slice(0, 5).length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-slate-400">
                <MessageSquare className="w-8 h-8 opacity-30" />
                <p className="text-[13px] font-medium">No inquiries yet.</p>
              </div>
            ) : (
              recentInquiries.slice(0, 5).map((inq) => {
                const typeCfg = INQUIRY_TYPES[inq.type];
                return (
                  <div key={inq._id} className="p-4 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${typeCfg.color}`}
                    >
                      <typeCfg.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[13px] text-slate-900 dark:text-white truncate">
                        {inq.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        From: {inq.senderName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1.5 min-w-[80px]">
                      <div className="flex items-center gap-2">
                        {inq.priority === "high" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        )}
                        <span
                          className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${INQUIRY_STATUS[inq.status].cls}`}
                        >
                          {inq.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {timeAgo(inq.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listings Growth Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-royal-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
              Listings Overview
            </h3>
          </div>
          <div className="h-[250px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { name: "Mon", approved: 12, pending: 5 },
                    { name: "Tue", approved: 19, pending: 8 },
                    { name: "Wed", approved: 15, pending: 15 },
                    { name: "Thu", approved: 22, pending: 4 },
                    { name: "Fri", approved: 28, pending: 12 },
                    { name: "Sat", approved: 35, pending: 18 },
                    { name: "Sun", approved: 42, pending: 10 },
                  ]}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorApproved"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#023E8A" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#023E8A" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorPending"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ fontSize: "13px", fontWeight: "bold" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="approved"
                    name="Approved"
                    stroke="#023E8A"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorApproved)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    name="Pending"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorPending)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse">
                <p className="text-[12px] text-slate-400">Loading charts...</p>
              </div>
            )}
          </div>
        </div>

        {/* User Registration Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
              User Acquisition
            </h3>
          </div>
          <div className="h-[250px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Jan", users: 400, agents: 240 },
                    { name: "Feb", users: 300, agents: 139 },
                    { name: "Mar", users: 200, agents: 980 },
                    { name: "Apr", users: 278, agents: 390 },
                    { name: "May", users: 189, agents: 480 },
                    { name: "Jun", users: 239, agents: 380 },
                  ]}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  barSize={12}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ fontSize: "13px", fontWeight: "bold" }}
                  />
                  <Bar
                    dataKey="users"
                    name="Regular Users"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="agents"
                    name="Agents"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg animate-pulse">
                <p className="text-[12px] text-slate-400">Loading charts...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

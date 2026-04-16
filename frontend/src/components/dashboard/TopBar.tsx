"use client";

import Link from "next/link";
import { Menu, Bell, Home, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { NotificationDropdown } from "../layout/NotificationDropdown";
import { usePathname, useRouter } from "next/navigation";

interface TopBarProps {
  setSidebarOpen: (open: boolean) => void;
  handleLogout: () => void;
  user: any;
}

const navLabels: Record<string, string> = {
  dashboard: "Dashboard",
  inbox: "Inbox",
  "property-listings": "All Listings",
  "post-listing": "Post a Listing",
  "props-shop": "Props Shop",
  "buy-product": "Buy Product",
  "order-history": "Order History",
  settings: "Settings",
};

export function TopBar({ setSidebarOpen, handleLogout, user }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const currentPathSegment =
    pathname === "/dashboard" ? "dashboard" : pathname.split("/").pop() || "";
  const activeTabLabel = navLabels[currentPathSegment] || "Dashboard";
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-5 gap-4 shrink-0">
      {/* Mobile menu toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-[15px] font-bold text-slate-800 dark:text-white">
          {activeTabLabel}
        </h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 hover:text-royal-800 transition-colors"
        >
          <Home className="w-4 h-4" /> Home
        </Link>

        {/* Use the new notification dropdown instead of the static bell icon */}
        <div className="text-slate-500 dark:text-slate-400">
           <NotificationDropdown isDashboard />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full bg-royal-100 dark:bg-royal-900 flex items-center justify-center text-royal-800 dark:text-royal-400 font-bold text-xs uppercase overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-royal-500/30">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.[0] || <User className="w-4 h-4" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[180px] p-2.5 rounded-xl shadow-xl border border-slate-200 bg-white dark:bg-slate-900 mt-2"
          >
            <div className="flex flex-col mb-2 px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-800 dark:text-white text-[13px] truncate capitalize">
                {user?.name || "User"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-white/40 truncate">
                {user?.email || "user@example.com"}
              </span>
            </div>
            <div className="space-y-1">
              <DropdownMenuItem
                onSelect={() => router.push("/dashboard/settings")}
                className="w-full flex items-center justify-start py-2 px-3 rounded-xl text-slate-700 dark:text-slate-200 focus:bg-royal-50 focus:text-royal-800 dark:focus:bg-royal-950 dark:focus:text-royal-400 hover:bg-royal-50 hover:text-royal-800 dark:hover:bg-royal-950 dark:hover:text-royal-400 transition-colors cursor-pointer text-[13px] font-medium"
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleLogout}
                className="w-full flex items-center justify-start py-2 px-3 rounded-xl text-red-600 dark:text-red-400 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30 dark:focus:text-red-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors cursor-pointer text-[13px] font-medium"
              >
                Logout
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  PlusSquare,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  LogOut,
  User,
  X,
  ChevronRight,
  ChevronDown,
  Settings as SettingsIcon,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: any;
  handleLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  subItems?: { id: string; label: string; icon: any }[];
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "inbox", label: "Inbox", icon: MessageSquare },
  {
    id: "property-management",
    label: "Property Management",
    icon: Building2,
    subItems: [
      { id: "property-listings", label: "All Listings", icon: ClipboardList },
      { id: "post-listing", label: "Post a Listing", icon: PlusSquare },
    ],
  },
  {
    id: "props-shop",
    label: "Props Shop",
    icon: ShoppingBag,
    subItems: [
      { id: "props-shop", label: "Browse Shop", icon: ShoppingBag },
      { id: "buy-product", label: "Checkout", icon: ShoppingCart },
      { id: "order-history", label: "Order History", icon: ClipboardList },
    ],
  },
];

const adminNavItems: NavItem[] = [
  {
    id: "admin",
    label: "Admin Panel",
    icon: ShieldCheck,
    subItems: [
      { id: "admin/overview", label: "Overview", icon: LayoutDashboard },
      { id: "admin/listings", label: "Listings", icon: Building2 },
      { id: "admin/users", label: "Users", icon: ShieldCheck },
      { id: "admin/orders", label: "Shop Orders", icon: ShoppingCart },
      { id: "admin/inquiries", label: "Inquiries", icon: MessageSquare },
      { id: "admin/config", label: "Configuration", icon: SettingsIcon },
    ],
  },
];

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  user,
  handleLogout,
}: SidebarProps) {
  const pathname = usePathname();

  // Proper active path logic for nested routes
  const getIsActive = (id: string) => {
    if (id === "dashboard") return pathname === "/dashboard";
    return pathname.startsWith(`/dashboard/${id}`);
  };

  const [openDropdowns, setOpenDropdowns] = useState<string[]>([
    "property-management",
    "props-shop",
    "admin-admin",
  ]);

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-royal-900 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col shrink-0
          transform transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        `}
      >
        {/* ── Logo (same h-16 as TopBar) ── */}
        <div className="h-16 flex items-center gap-3 px-5 shrink-0 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-9 h-9" />
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-black tracking-tight text-slate-800 dark:text-white mb-1">
                Royal
                <span className="text-royal-600 dark:text-royal-400">
                  Property
                </span>
              </span>
              <span className="text-[8px] text-slate-500 dark:text-white/40 tracking-[0.12em] uppercase font-semibold">
                Har Pata, Humain Pata Hai
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 pt-5 pb-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const hasSub = !!item.subItems;
            const isSubActive = item.subItems?.some((sub) =>
              getIsActive(sub.id),
            );
            const active = getIsActive(item.id) || isSubActive;
            const isOpen = openDropdowns.includes(item.id);

            const WrapperTag = hasSub ? "button" : Link;
            const linkProps = hasSub
              ? { onClick: () => toggleDropdown(item.id) }
              : {
                  href:
                    item.id === "dashboard"
                      ? "/dashboard"
                      : `/dashboard/${item.id}`,
                  onClick: () => setSidebarOpen(false),
                };

            return (
              <div key={item.id}>
                {/* @ts-ignore - polymorphic tag */}
                <WrapperTag
                  {...linkProps}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg group
                    text-[14.5px] font-medium transition-all duration-150 cursor-pointer text-left
                    ${
                      active && !hasSub
                        ? "bg-[#daf1f5] dark:bg-royal-500/20 text-royal-700 dark:text-royal-300 font-semibold"
                        : active && hasSub
                          ? "text-royal-700 dark:text-royal-300 font-semibold"
                          : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white/90"
                    }
                  `}
                >
                  <item.icon className="w-[17px] h-[17px] shrink-0 transition-colors" />
                  <span className="flex-1">{item.label}</span>
                  {hasSub ? (
                    isOpen ? (
                      <ChevronDown className="w-4 h-4 opacity-70" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-70" />
                    )
                  ) : active ? (
                    <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" />
                  ) : null}
                </WrapperTag>

                {hasSub && isOpen && (
                  <div className="mt-1 ml-4 pl-3 space-y-0.5 border-l border-slate-200 dark:border-white/10">
                    {item.subItems!.map((sub) => {
                      const subActive = getIsActive(sub.id);
                      return (
                        <Link
                          key={sub.id}
                          href={`/dashboard/${sub.id}`}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg group
                            text-[14px] font-medium transition-all duration-150 cursor-pointer text-left
                            ${
                              subActive
                                ? "bg-royal-100 dark:bg-royal-500/20 text-royal-700 dark:text-royal-300 font-semibold"
                                : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white/90"
                            }
                          `}
                        >
                          <sub.icon className="w-[15px] h-[15px] shrink-0 transition-colors" />
                          <span className="flex-1">{sub.label}</span>
                          {subActive && (
                            <ChevronRight className="w-3 h-3 ml-auto shrink-0" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* ── Admin nav (only visible to admins) ── */}
          {user?.role === "admin" && (
            <div className="pt-4">
              <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest px-3 mb-1">
                Administration
              </p>
              {adminNavItems.map((item) => {
                const hasSub = !!item.subItems;
                const isSubActive = item.subItems?.some((sub) =>
                  pathname.includes(`/dashboard/${sub.id}`),
                );
                const active =
                  pathname === `/dashboard/${item.id}` || isSubActive;
                const isOpen = openDropdowns.includes(`admin-${item.id}`);

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleDropdown(`admin-${item.id}`)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5
                        text-[14.5px] font-medium transition-all duration-150 cursor-pointer text-left
                        ${
                          active
                            ? "text-royal-700 dark:text-royal-300 font-semibold"
                            : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white/90"
                        }
                      `}
                    >
                      <item.icon className="w-[17px] h-[17px] shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 opacity-70" />
                      ) : (
                        <ChevronRight className="w-4 h-4 opacity-70" />
                      )}
                    </button>

                    {hasSub && isOpen && (
                      <div className="mt-1 ml-4 pl-3 space-y-0.5 border-l border-slate-200 dark:border-white/10">
                        {item.subItems!.map((sub) => {
                          const subActive = pathname.includes(
                            `/dashboard/${sub.id}`,
                          );
                          return (
                            <Link
                              key={sub.id}
                              href={`/dashboard/${sub.id}`}
                              onClick={() => setSidebarOpen(false)}
                              className={`
                                w-full flex items-center gap-3 px-3 py-2 rounded-lg group
                                text-[14px] font-medium transition-all duration-150 cursor-pointer text-left
                                ${
                                  subActive
                                    ? "bg-royal-100 dark:bg-royal-500/20 text-royal-700 dark:text-royal-300 font-semibold"
                                    : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white/90"
                                }
                              `}
                            >
                              <sub.icon className="w-[15px] h-[15px] shrink-0" />
                              <span className="flex-1">{sub.label}</span>
                              {subActive && (
                                <ChevronRight className="w-3 h-3 ml-auto shrink-0" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Settings (always last) ── */}
          <div className="pt-2">
            <Link
              href="/dashboard/settings"
              onClick={() => setSidebarOpen(false)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-[14.5px] font-medium transition-all duration-150 cursor-pointer
                ${
                  getIsActive("settings")
                    ? "bg-[#daf1f5] dark:bg-royal-500/20 text-royal-700 dark:text-royal-300 font-semibold"
                    : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white/90"
                }
              `}
            >
              <SettingsIcon className="w-[17px] h-[17px] shrink-0 transition-colors" />
              <span className="flex-1">Settings</span>
              {getIsActive("settings") && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" />
              )}
            </Link>
          </div>
        </nav>

        {/* ── User footer ── */}
        <div className="p-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-1">
          {/* Avatar + name */}
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-royal-700 flex items-center justify-center font-bold text-xs text-white uppercase overflow-hidden shrink-0">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.[0] || <User className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 dark:text-white truncate capitalize">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-white/40 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12.5px] font-medium text-slate-500 dark:text-white/40 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

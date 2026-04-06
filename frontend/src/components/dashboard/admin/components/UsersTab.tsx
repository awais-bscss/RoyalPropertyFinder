"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Mail,
  MoreVertical,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
  User,
  UserCog,
  Users,
  Calendar,
  Building2,
} from "lucide-react";
import { ROLE_CONFIG, fmtDate } from "../types";
import type { UserRecord } from "../types";
import { DeleteUserModal } from "./DeleteUserModal";
import { TableSkeleton } from "@/components/ui/skeleton";

interface Props {
  users: UserRecord[];
  loading: boolean;
  onRoleChange: (user: UserRecord, role: string) => void;
  onDelete: (user: UserRecord) => void;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  userSearch: string;
  setUserSearch: (v: string) => void;
}

export function UsersTab({
  users,
  loading,
  onRoleChange,
  onDelete,
  roleFilter,
  setRoleFilter,
  userSearch,
  setUserSearch,
}: Props) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = users.filter(
    (u) =>
      u.role !== "admin" &&
      (
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
      ),
  );

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-royal-400 placeholder:text-slate-400"
          />
        </div>
        <div className="relative shrink-0">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-4 pr-8 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="agent">Agents</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Count badge */}
        <div className="shrink-0 text-[12px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800">
        {loading ? (
          <TableSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <Users className="w-10 h-10 opacity-40" />
            <p className="font-semibold text-[14px]">No users found</p>
            <p className="text-[12px] text-slate-400">Try changing the search or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">

              {/* ── Head ── */}
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[35%]">
                    User
                  </th>
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden md:table-cell w-[15%]">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden lg:table-cell w-[12%]">
                    Listings
                  </th>
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden lg:table-cell w-[15%]">
                    Joined
                  </th>
                  <th className="text-center px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[8%]">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* ── Body ── */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((user, rowIndex) => {
                  const dropUp = rowIndex >= filtered.length - 2;
                  const rc = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* ── User Column ── */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-royal-700 text-white flex items-center justify-center font-bold text-sm uppercase overflow-hidden shrink-0 border-2 border-royal-200/40">
                            {user.profilePic ? (
                              <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                            ) : (
                              user.name?.[0]
                            )}
                          </div>
                          {/* Info */}
                          <div className="min-w-0">
                            <p className="font-bold text-[13.5px] text-slate-900 dark:text-white truncate max-w-[200px]">
                              {user.name}
                            </p>
                            <div className="flex flex-col gap-0.5 mt-0.5">
                              {user.email && (
                                <a
                                  href={`mailto:${user.email}`}
                                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-royal-600 transition-colors truncate"
                                >
                                  <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                                  <span className="truncate max-w-[180px]">{user.email}</span>
                                </a>
                              )}
                              {user.phone && (
                                <a
                                  href={`tel:${user.phone}`}
                                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-600 transition-colors"
                                >
                                  <Phone className="w-3 h-3 shrink-0 text-slate-400" />
                                  {user.phone}
                                </a>
                              )}
                            </div>
                            {/* Mobile-only role badge */}
                            <span className={`md:hidden inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${rc.cls}`}>
                              <rc.icon className="w-2.5 h-2.5" />
                              {rc.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ── Role Column ── */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${rc.cls}`}>
                          <rc.icon className="w-3 h-3" />
                          {rc.label}
                        </span>
                      </td>

                      {/* ── Listings Column ── */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-[13px] font-black text-slate-800 dark:text-slate-200">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {user.listingCount ?? 0}
                        </div>
                      </td>

                      {/* ── Joined Column ── */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {fmtDate(user.createdAt)}
                        </div>
                      </td>

                      {/* ── Actions Column ── */}
                      <td className="px-4 py-3">
                        <div
                          className="relative flex justify-center"
                          ref={openMenu === user._id ? menuRef : undefined}
                        >
                          {/* 3-dot trigger */}
                          <button
                            onClick={() => setOpenMenu(openMenu === user._id ? null : user._id)}
                            className="p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
                            title="Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown */}
                          {openMenu === user._id && (
                            <div
                              className={`absolute right-0 z-50 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm shadow-lg overflow-hidden animate-in fade-in duration-150 ${
                                dropUp ? "bottom-8 slide-in-from-bottom-1" : "top-8 slide-in-from-top-1"
                              }`}
                            >
                              {/* Change Role section */}
                              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  Change Role
                                </p>
                              </div>
                              {(["user", "agent", "admin"] as const)
                                .filter((r) => r !== user.role)
                                .map((role) => (
                                  <button
                                    key={role}
                                    onClick={() => { onRoleChange(user, role); setOpenMenu(null); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                                  >
                                    {role === "user" && <User className="w-3.5 h-3.5 text-slate-400" />}
                                    {role === "agent" && <UserCog className="w-3.5 h-3.5 text-blue-400" />}
                                    {role === "admin" && <ShieldCheck className="w-3.5 h-3.5 text-royal-500" />}
                                    Make {role.charAt(0).toUpperCase() + role.slice(1)}
                                  </button>
                                ))}

                              {/* Divider + Delete */}
                              <div className="border-t border-slate-100 dark:border-slate-800" />
                              <button
                                onClick={() => { setDeleteTarget(user); setOpenMenu(null); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer text-left"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete User
                              </button>
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
      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onConfirm={() => { onDelete(deleteTarget); setDeleteTarget(null); }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

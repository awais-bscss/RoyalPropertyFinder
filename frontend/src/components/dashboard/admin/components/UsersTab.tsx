"use client";

import { useState } from "react";
import {
  ChevronDown,
  Loader2,
  Mail,
  MoreVertical,
  Phone,
  Search,
  ShieldCheck,
  Trash2,
  User,
  UserCog,
  Users,
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

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-3">
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
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <TableSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
            <Users className="w-10 h-10 opacity-40" />
            <p className="font-semibold">No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((user) => {
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

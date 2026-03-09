"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { RefreshCcw, ShieldCheck } from "lucide-react";
import apiClient from "@/lib/axios";
import type { Listing, ListingStats, PlatformStats, UserRecord } from "./types";

// ── Shared context passed down to each page ───────────────────────────────────
export interface AdminContext {
  listings: Listing[];
  listingStats: ListingStats | null;
  listingsLoading: boolean;
  actionLoading: string | null;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  onApprove: (listing: Listing) => void;
  onReject: (listing: Listing, reason: string) => void;
  onToggleRoyalProject: (listing: Listing) => void;

  users: UserRecord[];
  platformStats: PlatformStats | null;
  usersLoading: boolean;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  userSearch: string;
  setUserSearch: (v: string) => void;
  onRoleChange: (user: UserRecord, role: string) => void;
  onDeleteUser: (user: UserRecord) => void;

  navigateToListings: () => void;
  navigateToUsers: () => void;
}

interface Props {
  children: (ctx: AdminContext) => React.ReactNode;
}

export function AdminPanel({ children }: Props) {
  // ── Listings state ──────────────────────────────────────────────────────────
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingStats, setListingStats] = useState<ListingStats | null>(null);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // ── Users state ─────────────────────────────────────────────────────────────
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(
    null,
  );
  const [usersLoading, setUsersLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  // ── Fetch listings ──────────────────────────────────────────────────────────
  const fetchListings = useCallback(async () => {
    setListingsLoading(true);
    try {
      const [listingsRes, statsRes] = await Promise.all([
        apiClient.get(
          `/listings/admin/all${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`,
        ),
        apiClient.get("/listings/admin/stats"),
      ]);
      const listingsArr = Array.isArray((listingsRes as any).data)
        ? (listingsRes as any).data
        : [];
      setListings(listingsArr);
      setListingStats((statsRes as any).data || null);
    } catch {
      toast.error("Failed to load listings");
    } finally {
      setListingsLoading(false);
    }
  }, [statusFilter]);

  // ── Fetch users ─────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        apiClient.get(
          `/users/admin/all${roleFilter !== "all" ? `?role=${roleFilter}` : ""}`,
        ),
        apiClient.get("/users/admin/platform-stats"),
      ]);
      const usersArr = Array.isArray((usersRes as any).data)
        ? (usersRes as any).data
        : [];
      setUsers(usersArr);
      setPlatformStats((statsRes as any).data || null);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Listing actions ─────────────────────────────────────────────────────────
  const handleApprove = async (listing: Listing) => {
    setActionLoading(listing._id);
    try {
      await apiClient.patch(`/listings/admin/${listing._id}/approve`);
      toast.success(`"${listing.title}" approved!`);
      fetchListings();
    } catch {
      toast.error("Failed to approve");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (listing: Listing, reason: string) => {
    setActionLoading(listing._id);
    try {
      await apiClient.patch(`/listings/admin/${listing._id}/reject`, {
        reason,
      });
      toast.success("Listing rejected");
      fetchListings();
    } catch {
      toast.error("Failed to reject");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRoyalProject = async (listing: Listing) => {
    setActionLoading(listing._id);
    try {
      await apiClient.patch(`/listings/admin/${listing._id}/royal-project`);
      toast.success(
        `"${listing.title}" is ${
          listing.isRoyalProject ? "no longer" : "now"
        } a Royal Project!`,
      );
      fetchListings();
    } catch {
      toast.error("Failed to update Royal Project status");
    } finally {
      setActionLoading(null);
    }
  };

  // ── User actions ────────────────────────────────────────────────────────────
  const handleRoleChange = async (user: UserRecord, role: string) => {
    try {
      await apiClient.patch(`/users/admin/${user._id}/role`, { role });
      toast.success(`${user.name} is now a ${role}`);
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleDeleteUser = async (user: UserRecord) => {
    try {
      await apiClient.delete(`/users/admin/${user._id}`);
      toast.success(`${user.name} has been deleted`);
      fetchUsers();
      fetchListings();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleRefresh = () => {
    fetchListings();
    fetchUsers();
    toast.success("Refreshed!");
  };

  // ── Context object passed to children ───────────────────────────────────────
  const ctx: AdminContext = {
    listings,
    listingStats,
    listingsLoading,
    actionLoading,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    onApprove: handleApprove,
    onReject: handleReject,
    onToggleRoyalProject: handleToggleRoyalProject,

    users,
    platformStats,
    usersLoading,
    roleFilter,
    setRoleFilter,
    userSearch,
    setUserSearch,
    onRoleChange: handleRoleChange,
    onDeleteUser: handleDeleteUser,

    navigateToListings: () => {},
    navigateToUsers: () => {},
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-royal-600" />
            Admin Panel
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            Manage listings, users and platform settings
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Page content */}
      {children(ctx)}
    </div>
  );
}

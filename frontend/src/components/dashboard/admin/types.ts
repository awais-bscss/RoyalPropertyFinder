export interface UserRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "agent" | "admin";
  profilePic?: string;
  createdAt: string;
  listingCount: number;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  province: string;
  location: string;
  subtype: string;
  areaSize: number;
  areaUnit: string;
  purpose: "Sell" | "Rent";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  images: string[];
  bedrooms?: string;
  bathrooms?: string;
  rejectionReason?: string;
  isRoyalProject?: boolean;
  user?: {
    name: string;
    email: string;
    phone?: string;
    profilePic?: string;
  };
}

export interface ListingStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface InquiryStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
}

export interface PlatformStats {
  totalUsers: number;
  newUsersThisMonth: number;
}

export interface InquiryReply {
  message: string;
  adminName: string;
  createdAt: string;
}

export interface SupportInquiry {
  _id: string;
  subject: string;
  message: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  type: "support" | "billing" | "report" | "advertising";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  priority: "high" | "medium" | "low";
  replies?: InquiryReply[];
}

export interface PropertyInquiry {
  _id: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  createdAt: string;
  listing?: {
    _id: string;
    title: string;
    location: string;
    price: number;
    currency: string;
    images: string[];
  };
  seller?: {
    _id: string;
    name: string;
    email: string;
  };
}

// ── Display Maps & Helpers ──────────────────────────────────────────────────

import { Clock, CheckCircle2, XCircle, AlertCircle, HelpCircle, FileText, Flag, Megaphone } from "lucide-react";

export const LISTING_STATUS = {
  pending: {
    label: "Pending Review",
    cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    cls: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/20",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    cls: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-500 dark:border-rose-500/20",
    icon: XCircle,
  },
};

export const INQUIRY_TYPES = {
  support: { label: "Tech Support", icon: HelpCircle, color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20" },
  billing: { label: "Billing Issue", icon: FileText, color: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-500/20" },
  report: { label: "Report Abuse", icon: Flag, color: "text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/20" },
  advertising: { label: "Advertising", icon: Megaphone, color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/20" },
};

export const INQUIRY_STATUS = {
  open: { label: "Needs Reply", cls: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/20" },
  in_progress: { label: "In Progress", cls: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" },
  resolved: { label: "Resolved", cls: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10" },
};

import { User, UserCog, ShieldCheck } from "lucide-react";

export const ROLE_CONFIG = {
  user: {
    label: "User",
    icon: User,
    cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  },
  agent: {
    label: "Agent",
    icon: UserCog,
    cls: "bg-royal-100 text-royal-700 dark:bg-royal-500/20 dark:text-royal-400 border border-royal-200 dark:border-royal-500/30",
  },
  admin: {
    label: "Admin",
    icon: ShieldCheck,
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30",
  },
};


export function timeAgo(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export function fmtDate(ds: string) {
  return new Date(ds).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

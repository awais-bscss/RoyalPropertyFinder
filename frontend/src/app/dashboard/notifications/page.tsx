"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, 
  Trash2, 
  Check, 
  Inbox, 
  Search, 
  Filter, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NotificationService, INotification } from "@/services/notification.service";
import { toast } from "react-toastify";
import { ClearNotificationsModal } from "@/components/dashboard/notifications/ClearNotificationsModal";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await NotificationService.getMyNotifications();
      // Handle both array and {success, data} formats
      const items = Array.isArray(res) ? res : (res as any)?.data || [];
      setNotifications(items);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!window.confirm("Delete this notification?")) return;
    try {
      await NotificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await NotificationService.deleteAllNotifications();
      setNotifications([]);
      toast.success("Inbox cleared permanently");
      // The modal closing is handled by the state change
    } catch (err) {
      toast.error("Failed to clear inbox");
    } finally {
      setIsClearing(false);
      setIsClearModalOpen(false); // Close always on finish
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = 
      filter === "all" ? true :
      filter === "unread" ? !n.isRead :
      n.isRead;
    
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
            <div className="w-10 h-10 bg-royal-600 rounded-sm flex items-center justify-center text-white shadow-md shadow-royal-600/20">
              <Bell size={20} />
            </div>
            Notification Center
          </h1>
          <p className="text-[13px] font-bold text-slate-400 mt-1 uppercase tracking-tight">System Alerts & User Activity</p>
        </div>
        
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button 
              onClick={() => setIsClearModalOpen(true)}
              className="px-4 py-2 text-[12px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-sm border border-rose-100 dark:border-rose-900/30 transition shadow-sm cursor-pointer"
            >
              Clear History
            </button>
          )}
          <button 
            onClick={fetchNotifications}
            className="px-4 py-2 text-[12px] font-black uppercase tracking-widest text-royal-600 hover:bg-royal-50 dark:hover:bg-royal-900/20 rounded-sm border border-royal-100 dark:border-royal-900/30 transition shadow-sm cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* ── Stats Summary ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Unread</p>
                <p className="text-2xl font-black text-royal-600 animate-pulse">{notifications.filter(n => !n.isRead).length}</p>
            </div>
            <div className="w-10 h-10 rounded-sm bg-royal-50 dark:bg-royal-900/20 flex items-center justify-center text-royal-600">
                <AlertCircle size={20} />
            </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total History</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{notifications.length}</p>
            </div>
            <div className="w-10 h-10 rounded-sm bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Inbox size={20} />
            </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Storage Status</p>
                <p className="text-2xl font-black text-emerald-600">Healthy</p>
            </div>
            <div className="w-10 h-10 rounded-sm bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={20} />
            </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row gap-3 items-center mb-6 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search activity logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-[13px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-royal-400 transition"
          />
        </div>
        <div className="flex w-full md:w-auto p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm gap-1">
          {(["all", "unread", "read"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all cursor-pointer ${
                filter === t 
                  ? "bg-white dark:bg-slate-700 text-royal-600 shadow-sm border border-slate-200/50 dark:border-slate-600" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notification List ── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-royal-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Synchronizing records...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center px-6">
            <Inbox size={48} className="text-slate-100 dark:text-slate-800 mb-4" />
            <p className="text-[14px] font-black text-slate-800 dark:text-white uppercase tracking-tight">No activity found</p>
            <p className="text-[12px] text-slate-400 mt-1 font-bold">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-6 py-4 font-black text-[11px] text-slate-400 uppercase tracking-widest w-[180px]">Type & Date</th>
                  <th className="text-left px-6 py-4 font-black text-[11px] text-slate-400 uppercase tracking-widest">Message Content</th>
                  <th className="text-center px-6 py-4 font-black text-[11px] text-slate-400 uppercase tracking-widest w-[160px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredNotifications.map((n) => (
                  <tr 
                    key={n._id} 
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all group ${
                      !n.isRead ? "bg-royal-50/10 dark:bg-royal-900/5" : ""
                    }`}
                  >
                    <td className="px-6 py-5 align-top">
                        <div className="flex items-center gap-2 mb-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${!n.isRead ? 'bg-royal-500 shadow-md shadow-royal-500/50 pulse' : 'bg-slate-200 dark:bg-slate-700'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                              n.type.includes('report') ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/50' :
                              n.type.includes('inquiry') ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/50' :
                              'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                           }`}>
                             {n.type.replace(/_/g, ' ')}
                           </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <Calendar size={12} />
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                    </td>

                    <td className="px-6 py-5 align-top">
                        <h3 className={`text-[14px] font-black mb-1 ${!n.isRead ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                          {n.title}
                        </h3>
                        <p className={`text-[13px] leading-relaxed max-w-2xl ${!n.isRead ? "text-slate-600 dark:text-slate-300" : "text-slate-400 font-bold"}`}>
                          {n.message}
                        </p>
                    </td>

                    <td className="px-6 py-5 align-top text-center">
                       <div className="flex flex-col gap-2">
                          {n.link && (
                             <Link 
                                href={n.link}
                                className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-royal-600 hover:bg-royal-700 text-white rounded-sm text-[11px] font-black uppercase tracking-widest transition-all"
                             >
                               Jump <ChevronRight size={12} />
                             </Link>
                          )}
                          <div className="flex items-center gap-1.5 justify-center">
                            {!n.isRead && (
                              <button 
                                onClick={() => handleMarkAsRead(n._id)}
                                className="p-1 px-2 text-[10px] font-black uppercase text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-sm border border-emerald-100 dark:border-emerald-800 transition cursor-pointer"
                              >
                                Read
                              </button>
                            )}
                            <button 
                              onClick={(e) => handleDelete(n._id, e)}
                              className="p-1 px-2 text-[10px] font-black uppercase text-rose-50 hover:bg-rose-500 hover:text-white bg-rose-500/10 text-rose-500 rounded-sm border border-rose-200/50 dark:border-rose-900 transition-all cursor-pointer"
                            >
                              Del
                            </button>
                          </div>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ClearNotificationsModal 
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearAll}
        loading={isClearing}
      />
    </div>
  );
}

"use client";

console.log("[Notification System] FULL MODULE LOADED");

import * as React from "react";
import Link from "next/link";
import { Bell, Check, Trash2, Inbox, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { NotificationService, INotification } from "@/services/notification.service";
import { toast } from "react-toastify";
import { ClearNotificationsModal } from "@/components/dashboard/notifications/ClearNotificationsModal";
import { useSelector } from "react-redux";

interface NotificationDropdownProps {
  isDashboard?: boolean;
}

export function NotificationDropdown({ isDashboard }: NotificationDropdownProps) {
  const [notifications, setNotifications] = React.useState<INotification[]>([]);
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = React.useState(false);
  const [isClearing, setIsClearing] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    // Only fetch if user is logged in to avoid unnecessary API noise/timeouts
    if (!isAuthenticated) return;
    
    try {
      const res = await NotificationService.getMyNotifications();
      
      // Handle both formats: { success: true, data: [] } or just []
      const items = Array.isArray(res) ? res : (res as any)?.data || [];
      
      setNotifications(items);
      setUnreadCount(items.filter((n: INotification) => !n.isRead).length);
    } catch (error) {
      console.error("[Notification System] Fetch failed:", error);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
       fetchNotifications();
    }
    const interval = setInterval(() => {
      if (isAuthenticated) fetchNotifications();
    }, 30000); // Poll every 30 seconds
    
    // Close on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchNotifications();
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await NotificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      const deleted = notifications.find(n => n._id === id);
      if (deleted && !deleted.isRead) {
         setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await NotificationService.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      toast.success("Inbox cleared permanently");
    } catch (error) {
      toast.error("Failed to clear inbox");
    } finally {
      setIsClearing(false);
      setIsClearModalOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
        <button 
          onClick={handleToggle}
          className={`relative p-2 rounded-xl transition-all focus:outline-none cursor-pointer flex items-center justify-center group ${
          isDashboard 
            ? "text-slate-500 hover:text-royal-800 hover:bg-royal-50 dark:hover:bg-royal-950/20" 
            : "text-white hover:bg-royal-700/50"
        }`}>
          <Bell className={`w-5 h-5 group-hover:scale-110 transition-transform ${unreadCount > 0 ? "animate-pulse" : ""}`} />
          {unreadCount > 0 && (
            <span className="absolute px-1.5 min-w-[18px] h-[18px] bg-rose-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-lg shadow-rose-600/40 -top-0.5 -right-0.5">
               {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
           <div className="absolute right-0 top-12 w-[340px] md:w-[380px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
             {/* Header */}
             <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
               <div className="flex items-center gap-2">
                 <h3 className="font-bold text-slate-800 dark:text-white text-[15px]">Notifications</h3>
                 {unreadCount > 0 && (
                   <span className="px-1.5 py-0.5 bg-royal-100 text-royal-700 dark:bg-royal-900/40 dark:text-royal-400 text-[9px] font-black rounded-md uppercase">
                     {unreadCount} NEW
                   </span>
                 )}
               </div>
               <div className="flex items-center gap-3">
                 {notifications.length > 0 && (
                    <button onClick={handleMarkAllRead} className="text-[10px] font-black text-royal-600 hover:text-royal-700 dark:text-royal-400 uppercase tracking-widest cursor-pointer">
                      Mark all read
                    </button>
                 )}
                 <button 
                   onClick={() => setIsOpen(false)} 
                   className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                 >
                    <X size={16} />
                 </button>
               </div>
             </div>

             {/* Content */}
             <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                {notifications && notifications.length > 0 ? (
                  <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/50">
                     {notifications.map((n) => (
                       <div 
                          key={n._id}
                          className={`relative px-4 py-4 transition-all ${!n.isRead ? "bg-royal-50/30 dark:bg-royal-800/10" : ""}`}
                       >
                          <div className="flex gap-3">
                             <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.isRead ? "bg-transparent" : "bg-royal-600 shadow-sm shadow-royal-600"}`} />
                             <div className="flex-1">
                                <div className="flex justify-between items-start">
                                   <p className={`text-[13px] font-bold mb-0.5 ${n.isRead ? "text-slate-400" : "text-slate-900 dark:text-white"}`}>{n.title}</p>
                                   <span className="text-[10px] text-slate-400 font-bold">
                                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                   </span>
                                </div>
                                <p className={`text-[12px] leading-relaxed line-clamp-3 mb-2 ${n.isRead ? "text-slate-400" : "text-slate-600 dark:text-slate-300"}`}>{n.message}</p>
                                
                                <div className="flex items-center gap-4 mt-2">
                                   {n.link && (
                                     <Link 
                                        href={n.link} 
                                        onClick={(e) => {
                                          setIsOpen(false);
                                        }} 
                                        className="text-[10px] font-black text-royal-600 hover:text-royal-700 underline uppercase tracking-wider transition-colors"
                                     >
                                        View Page
                                     </Link>
                                   )}
                                   {!n.isRead && (
                                     <button 
                                        onClick={(e) => handleMarkAsRead(n._id, e)} 
                                        className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-wider cursor-pointer transition-colors"
                                     >
                                        Mark Read
                                     </button>
                                   )}
                                </div>
                             </div>
                             <button onClick={(e) => handleDelete(n._id, e)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer">
                                <X size={14} />
                             </button>
                          </div>
                       </div>
                     ))}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                     <Inbox className="w-12 h-12 text-slate-100 dark:text-slate-800 mb-4" />
                     <p className="text-[14px] font-bold text-slate-800 dark:text-slate-100">Notification box is empty</p>
                     <p className="text-[12px] text-slate-500 mt-1 max-w-[200px]">You have no new alerts at the moment.</p>
                  </div>
                )}
             </div>
             
             {/* Footer */}
             <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)} className="text-[11px] font-black text-slate-500 hover:text-royal-600 uppercase tracking-widest transition-colors">
                  View History
                </Link>
                {notifications.length > 0 && (
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       setIsClearModalOpen(true);
                     }} 
                     className="text-[11px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest cursor-pointer transition-colors"
                   >
                     Clear All
                   </button>
                )}
             </div>
             
             <ClearNotificationsModal 
               isOpen={isClearModalOpen}
               onClose={() => setIsClearModalOpen(false)}
               onConfirm={handleClearAll}
               loading={isClearing}
             />
           </div>
        )}
    </div>
  );
}

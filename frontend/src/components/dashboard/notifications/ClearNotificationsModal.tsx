"use client";

import React from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";

interface ClearNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function ClearNotificationsModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading 
}: ClearNotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-sm border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <h3 className="text-[14px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Trash2 size={16} className="text-rose-500" />
              Clear History
           </h3>
           <button 
             onClick={onClose}
             className="p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
           >
              <X size={18} />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
           <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-4 border border-rose-100 dark:border-rose-900/30">
              <AlertTriangle size={32} />
           </div>
           <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Are you absolutely sure?</h4>
           <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              This action cannot be undone. All your read and unread notification history will be permanently erased from your dashboard.
           </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
           <button
             onClick={onClose}
             className="flex-1 py-2.5 text-[12px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
           >
              Back Out
           </button>
           <button
             onClick={onConfirm}
             disabled={loading}
             className="flex-1 py-2.5 text-[12px] font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 rounded-sm shadow-md shadow-rose-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
           >
              {loading ? "Clearing..." : "Delete All"}
           </button>
        </div>
      </div>
    </div>
  );
}

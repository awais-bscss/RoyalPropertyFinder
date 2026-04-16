"use client";

import React from "react";
import { X, Flag, User, Calendar, ExternalLink, AlertTriangle, Building2 } from "lucide-react";
import { format } from "date-fns";

interface ViewReportModalProps {
  report: {
    _id: string;
    listing: {
      _id: string;
      title: string;
      price: number;
      location: string;
      images: string[];
      currency: string;
    };
    reporter: {
      _id: string;
      name: string;
      email: string;
    };
    reason: string;
    description: string;
    status: string;
    createdAt: string;
  };
  onClose: () => void;
}

export function ViewReportModal({ report, onClose }: ViewReportModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-sm border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
           <h3 className="text-[14px] font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <Flag size={16} className="text-rose-500" />
              Full Report Details
           </h3>
           <button 
             onClick={onClose}
             className="p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
           >
              <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Property Info */}
              <div className="space-y-6">
                 <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Reported Property</p>
                    <div className="flex gap-4">
                       <div className="w-20 h-20 rounded-sm overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                          <img src={report.listing?.images?.[0] || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-1">{report.listing?.title}</p>
                          <p className="text-[12px] text-royal-600 font-bold">{report.listing?.currency} {report.listing?.price?.toLocaleString()}</p>
                          <a 
                            href={`/properties/${report.listing?._id}`} 
                            target="_blank" 
                            className="text-[11px] font-bold text-slate-500 hover:text-royal-600 flex items-center gap-1 mt-2 underline"
                          >
                             Open Listing <ExternalLink size={11} />
                          </a>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Reported By</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <User size={18} />
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 dark:text-white">{report.reporter?.name}</p>
                          <p className="text-[12px] text-slate-500">{report.reporter?.email}</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Filing Date</p>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                       <Calendar size={14} />
                       <span className="text-[13px] font-medium">{format(new Date(report.createdAt), "MMMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                 </div>
              </div>

              {/* Right Column: Violation Details */}
              <div className="space-y-6">
                 <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Violation Reason</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-rose-50 dark:bg-rose-900/20 text-rose-600 border border-rose-100 dark:border-rose-900/30">
                       <AlertTriangle size={14} />
                       <span className="text-[12px] font-black uppercase tracking-tight">{report.reason}</span>
                    </div>
                 </div>

                 <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Description</p>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-sm border border-slate-100 dark:border-slate-800">
                       <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap italic">
                          "{report.description || "No specific details provided."}"
                       </p>
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
           <button
             onClick={onClose}
             className="px-6 py-2.5 text-[12px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
           >
              Dismiss Details
           </button>
        </div>
      </div>
    </div>
  );
}

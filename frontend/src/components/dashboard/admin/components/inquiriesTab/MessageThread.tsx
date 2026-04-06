"use client";

import { User, Building2, ExternalLink, Paperclip, Mail, Phone } from "lucide-react";
import { Trash2 } from "lucide-react";

interface MessageThreadProps {
  activeInquiry: any;
  mode: "support" | "property";
  confirmDeleteReply: (id: string) => void;
}

export function MessageThread({
  activeInquiry,
  mode,
  confirmDeleteReply
}: MessageThreadProps) {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
      {/* Property Details Card (Only for property inquiries) */}
      {mode === 'property' && activeInquiry.listing && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm overflow-hidden hover:border-royal-200 dark:hover:border-royal-800 transition-all group">
          <div className="p-3 flex gap-4">
            <div className="w-24 h-16 rounded-sm overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0">
              {activeInquiry.listing.images?.[0] ? (
                <img src={activeInquiry.listing.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center italic text-[10px] text-slate-400">No Image</div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-tight truncate pr-4">{activeInquiry.listing.title}</h4>
                <a href={`/properties/${activeInquiry.listing._id}`} target="_blank" rel="noopener noreferrer" className="text-royal-600 hover:text-royal-700 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest shrink-0 transition-colors">View <ExternalLink className="w-3 h-3" /></a>
              </div>
              <p className="text-[11px] font-bold text-slate-500 truncate flex items-center gap-1.5 mb-1"><Building2 className="w-3.5 h-3.5 text-royal-600" />{activeInquiry.listing.location}</p>
              <p className="text-[15px] font-black text-royal-600">{activeInquiry.listing.currency} {activeInquiry.listing.price?.toLocaleString()}</p>
            </div>
          </div>

          {/* Property Owner Info - Admin Feature */}
          <div className="px-3 py-2 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Owner:</span>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{activeInquiry.seller?.name || "Unknown Owner"}</span>
            </div>
            <div className="flex items-center gap-3">
              {activeInquiry.seller?.email && (
                <a href={`mailto:${activeInquiry.seller.email}`} className="text-slate-400 hover:text-royal-600 transition-colors" title={activeInquiry.seller.email}>
                  <Mail className="w-3.5 h-3.5" />
                </a>
              )}
              {activeInquiry.seller?.phone && (
                <a href={`tel:${activeInquiry.seller.phone}`} className="text-slate-400 hover:text-emerald-600 transition-colors" title={activeInquiry.seller.phone}>
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Initial Buyer Message */}
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 mt-0.5"><User className="w-4 h-4" /></div>
        <div className="max-w-[75%] items-start flex flex-col gap-1.5">
          <div className="px-4 py-3 rounded-sm text-[14px] leading-relaxed bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm font-medium">
            <p className="font-bold text-[11px] mb-1 text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 pb-0.5">
              {activeInquiry.senderName} ({mode === 'property' ? 'Buyer' : 'User'})
            </p>
            <div className="whitespace-pre-wrap">{activeInquiry.message}</div>
          </div>
          <span className="text-[11px] font-bold text-slate-400 ml-1 opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-tight">
            {new Date(activeInquiry.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Replies History */}
      {activeInquiry.replies?.map((rep: any, idx: number) => (
        <div key={idx} className="flex gap-3 flex-row-reverse relative group/reply">
          <div className="w-9 h-9 rounded-full bg-royal-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5 shadow-md shadow-royal-500/20 shadow-lg">
            <User className="w-4 h-4" />
          </div>
          
          <div className="max-w-[75%] items-end flex flex-col gap-1.5 relative">
            <button 
              onClick={() => confirmDeleteReply(rep._id)}
              className="absolute -left-10 top-2 p-1.5 text-slate-300 dark:text-slate-600 hover:text-rose-500 opacity-0 group-hover/reply:opacity-100 transition-all rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer z-20"
              title="Delete this reply"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="px-4 py-3 rounded-sm text-[14px] leading-relaxed bg-royal-600 text-white shadow-md shadow-royal-500/10 text-left w-full">
              <p className="font-bold text-[11px] mb-1 opacity-80 border-b border-white/20 pb-0.5 uppercase tracking-widest">
                {rep.adminName || rep.senderName} ({rep.adminName ? 'Admin' : (mode === 'property' ? 'Owner' : 'Staff')})
              </p>
              <div className="whitespace-pre-wrap font-sans font-medium">{rep.message}</div>
              
              {rep.attachments && rep.attachments.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/20 flex flex-col gap-2">
                  {rep.attachments.map((file: any, i: number) => (
                    <a 
                      key={i}
                      href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${file.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between group/file bg-white/10 hover:bg-white/20 p-2.5 rounded transition-all border border-white/5 w-full text-left"
                    >
                      <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1 mr-3">
                        <Paperclip className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate text-[11px] font-bold uppercase tracking-tight" title={file.filename}>{file.filename}</span>
                      </div>
                      <div className="shrink-0 opacity-0 group-hover/file:opacity-100 transition-opacity">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-400 mr-1 opacity-70 uppercase tracking-tight">
              {new Date(rep.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

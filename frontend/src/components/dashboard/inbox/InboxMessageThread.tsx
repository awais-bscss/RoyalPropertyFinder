"use client";

import { User, Building2, ExternalLink, Paperclip, Trash2 } from "lucide-react";

interface InboxMessageThreadProps {
  selected: any;
  setReplyToDelete: (id: string) => void;
}

export function InboxMessageThread({
  selected,
  setReplyToDelete
}: InboxMessageThreadProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {/* Property Context Card */}
      <div className="px-6 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm relative z-10">
         <div className="flex gap-4 p-2.5 rounded-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-16 rounded-sm overflow-hidden border border-white dark:border-slate-700 shadow-sm shrink-0 bg-white">
                {selected.listing?.images?.[0] ? (
                  <img src={selected.listing.images[0]} alt="" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100"><Building2 className="w-5 h-5 text-slate-300" /></div>
                )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0 pr-4">
                    <p className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{selected.listing?.title}</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border shadow-sm shrink-0 ${selected.status === 'unread' ? 'bg-amber-100 text-amber-700 border-amber-200' : selected.status === 'replied' ? 'bg-blue-100 text-blue-700 border-blue-200' : selected.status === 'read' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {selected.status}
                    </span>
                  </div>
                  <a 
                    href={`/properties/${selected.listing?._id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-royal-600 hover:text-royal-700 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest shrink-0 transition-colors"
                  >
                    AD <ExternalLink className="w-3.5 h-3.5" />
                  </a>
               </div>
               <p className="text-[12px] font-bold text-slate-500 flex items-center gap-1 mb-0.5">
                 <Building2 className="w-3.5 h-3.5 text-royal-600" />
                 {selected.listing?.location}
               </p>
               <p className="text-[15px] font-black text-royal-600">
                 {selected.listing?.currency} {selected.listing?.price?.toLocaleString()}
               </p>
            </div>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
         {/* Initial Buyer Message */}
         <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 mt-0.5">
              <User className="w-4 h-4" />
            </div>
            <div className="max-w-[75%] items-start flex flex-col gap-1.5">
               <div className="px-4 py-3 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[14px] text-slate-800 dark:text-slate-200 shadow-sm leading-relaxed font-medium">
                  <p className="font-bold text-[11px] mb-1 text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 pb-0.5">
                    {selected.senderName} (Buyer)
                  </p>
                  <div className="whitespace-pre-wrap">{selected.message}</div>
               </div>
               <p className="text-[11px] font-bold text-slate-400 ml-1 opacity-70 uppercase tracking-tight">
                 {new Date(selected.createdAt).toLocaleString()}
               </p>
            </div>
         </div>

         {/* Dynamic History */}
         {selected.replies?.map((rep: any, idx: number) => (
            <div key={idx} className="flex gap-3 flex-row-reverse group/reply relative">
               <div className="w-9 h-9 rounded-full bg-royal-600 flex items-center justify-center text-white shadow-lg shadow-royal-500/20 shadow-xl shrink-0 mt-0.5 border border-royal-500">
                 <User className="w-4 h-4" />
               </div>
               
               <div className="max-w-[75%] items-end flex flex-col gap-1.5 relative">
                  <button 
                    onClick={() => setReplyToDelete(rep._id)} 
                    className="absolute -left-10 top-2 p-1.5 text-slate-300 dark:text-slate-600 hover:text-rose-500 opacity-0 group-hover/reply:opacity-100 transition-all rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer z-20"
                    title="Delete this message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  
                  <div className="px-4 py-3 rounded-sm bg-royal-600 text-white text-[14px] shadow-md shadow-royal-500/10 leading-relaxed text-left w-full">
                     <p className="font-bold text-[11px] mb-1 opacity-80 uppercase tracking-widest border-b border-white/20 pb-0.5">
                        {rep.senderName} (Owner)
                     </p>
                     <div className="whitespace-pre-wrap font-sans font-medium">{rep.message}</div>
                     
                     {/* Attachments */}
                     {rep.attachments?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/20 flex flex-col gap-2">
                           {rep.attachments.map((file: any, fidx: number) => (
                              <a 
                                key={fidx} 
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
                  <p className="text-[11px] font-bold text-slate-500 mr-1 opacity-70 uppercase tracking-tight">
                    {new Date(rep.createdAt).toLocaleString()}
                  </p>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

"use client";

import { RefreshCw, Search, Inbox as InboxIcon, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface InboxSidebarProps {
  inquiries: any[];
  selectedId: string | null;
  search: string;
  setSearch: (s: string) => void;
  loading: boolean;
  filter: "all" | "unread" | "read";
  setFilter: (f: any) => void;
  filtered: any[];
  handleSelect: (id: string) => void;
  fetchInquiries: () => void;
}

export function InboxSidebar({
  inquiries,
  selectedId,
  search,
  setSearch,
  loading,
  filter,
  setFilter,
  filtered,
  handleSelect,
  fetchInquiries
}: InboxSidebarProps) {
  return (
    <div className="w-[320px] md:w-[380px] shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-700">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
            <InboxIcon className="w-5 h-5 text-royal-600" />
            Property Leads
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-black bg-royal-600 text-white rounded-full">
              {inquiries.filter((c) => c.status === "unread").length}
            </span>
          </h2>
          <button 
            onClick={() => fetchInquiries()} 
            className="p-2 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-royal-600 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search leads..." 
            className="w-full pl-9 pr-3 py-2 text-[14px] font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-royal-400 transition-all font-sans" 
          />
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-700">
        {(["all", "unread", "read"] as const).map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest relative ${filter === f ? "text-royal-600" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
          >
            {f}
            {filter === f && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-royal-600" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4 border-b border-slate-50 dark:border-slate-800 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-slate-300 dark:text-slate-700 gap-2 font-bold uppercase text-[12px] italic tracking-widest text-center px-6">
            No matching entries found
          </div>
        ) : (
          filtered.map((c) => (
            <button 
              key={c._id} 
              onClick={() => handleSelect(c._id)} 
              className={`w-full text-left px-5 py-5 border-b border-slate-100 dark:border-slate-800 transition-all relative ${selectedId === c._id ? "bg-white dark:bg-slate-800 shadow-[inset_4px_0_0_0_#4f46e5]" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/10"}`}
            >
              <div className="flex items-start gap-4">
                  <div className="w-11 h-9 rounded-sm bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    {c.listing?.images?.[0] ? (
                      <img src={c.listing.images[0]} alt="" className="w-full h-full object-cover grayscale-[0.3]" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-[14px] truncate ${c.status === 'unread' ? "font-black text-slate-900 dark:text-white" : "font-semibold text-slate-600 dark:text-slate-400"}`}>
                        {c.senderName}
                      </span>
                      <span className="text-[10px] font-black text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-[11px] font-black truncate uppercase tracking-widest ${c.status === 'unread' ? "text-royal-600" : "text-slate-500 opacity-60"}`}>
                      {c.listing?.title}
                    </p>
                    <div className="flex justify-end mt-1">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border shadow-sm ${c.status === 'unread' ? 'bg-amber-100 text-amber-700 border-amber-200' : c.status === 'replied' ? 'bg-blue-100 text-blue-700 border-blue-200' : c.status === 'read' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

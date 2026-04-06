"use client";

import { Search, Building2, User, RefreshCw, MoreVertical, Filter, ChevronDown, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InquirySidebarProps {
  mode: "support" | "property";
  setMode: (m: "support" | "property") => void;
  inqStats: { support: number; property: number };
  search: string;
  setSearch: (s: string) => void;
  filter: "all" | "open" | "working" | "resolved" | "unread" | "read";
  setFilter: (f: any) => void;
  loading: boolean;
  filtered: any[];
  activeInquiry: any;
  handleSelect: (id: string, m: "support" | "property") => void;
  getAvatarBg: (name: string) => string;
  getInitials: (name: string) => string;
  INQUIRY_STATUS: any;
  onRefresh?: () => void;
}

export function InquirySidebar({
  mode,
  setMode,
  inqStats,
  search,
  setSearch,
  filter,
  setFilter,
  loading,
  filtered,
  activeInquiry,
  handleSelect,
  getAvatarBg,
  getInitials,
  INQUIRY_STATUS,
  onRefresh
}: InquirySidebarProps) {
  return (
    <div className="w-[320px] md:w-[380px] shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm relative z-0">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-sm bg-royal-50 dark:bg-royal-950/20 text-royal-600">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <h2 className="text-[17px] font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              Service Box
              <span className="bg-royal-600 text-white text-[10px] font-black h-5 px-1.5 rounded-full flex items-center justify-center min-w-[20px]">
                {mode === 'support' ? inqStats.support : inqStats.property}
              </span>
            </h2>
            <button 
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-royal-600 dark:hover:text-royal-400 transition-all rounded-full hover:bg-royal-50 dark:hover:bg-royal-900/20 disabled:opacity-50 cursor-pointer group"
              title="Refresh Inquiries"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-1 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-sm mb-4 border border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setMode('support')}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all ${mode === 'support' ? 'bg-white dark:bg-slate-700 text-royal-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            Support Inq
          </button>
          <button
            onClick={() => setMode('property')}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all ${mode === 'property' ? 'bg-white dark:bg-slate-700 text-royal-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            Property Inq
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative group flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-royal-500 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={mode === 'support' ? 'Search support messages...' : 'Search property messages...'}
              className="w-full pl-9 pr-3 py-2.5 text-[12px] font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-royal-500 focus:border-royal-500 transition-all placeholder:text-slate-400 uppercase tracking-tight"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2.5 text-slate-400 hover:text-royal-600 dark:hover:text-royal-400 transition-all rounded-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm group">
                <Filter className={`w-4 h-4 ${filter !== 'all' ? 'text-royal-600 fill-royal-600/20' : 'group-hover:text-royal-600'}`} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden font-black text-[12px]">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 py-2.5 px-3">Filter Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
              {(mode === 'support' ? ['all', 'open', 'working', 'resolved'] : ['all', 'unread', 'read']).map((f) => (
                <DropdownMenuItem 
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`flex items-center justify-between px-3 py-3 uppercase tracking-widest text-[10px] cursor-pointer focus:bg-royal-50 dark:focus:bg-royal-900/20 focus:text-royal-600 ${filter === f ? 'text-royal-600 bg-royal-50/50 dark:bg-royal-900/10' : 'text-slate-600'}`}
                >
                  {f}
                  {filter === f && <Check className="w-4 h-4 ml-2" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-2 animate-pulse">
              <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-3 w-48 bg-slate-100 dark:bg-slate-800" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-slate-300 dark:text-slate-700 gap-3 px-6">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800/50">
              <Search className="w-8 h-8 opacity-20" />
            </div>
            <p className="font-bold uppercase text-[11px] italic tracking-widest text-center leading-loose">No matching inquiries found in this category</p>
          </div>
        ) : (
          filtered.map((inq) => (
            <button
              key={inq._id}
              onClick={() => handleSelect(inq._id, mode)}
              className={`w-full text-left px-5 py-5 border-b border-slate-100 dark:border-slate-800 transition-all relative group ${activeInquiry?._id === inq._id ? 'bg-white dark:bg-slate-800 shadow-[inset_4px_0_0_0_#4f46e5]' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/10'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-9 h-9 rounded-full ${getAvatarBg(inq.senderName)} flex items-center justify-center text-white text-[12px] font-bold shadow-md shadow-royal-500/10 shrink-0`}
                >
                  {getInitials(inq.senderName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[13px] font-black text-slate-900 dark:text-white truncate">
                      {inq.senderName}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">
                      {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate opacity-90 leading-tight">
                    {mode === 'support' ? inq.subject : inq.listing?.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  {mode === 'support' ? (
                    <>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-royal-600 bg-royal-50 dark:bg-royal-500/10 px-1.5 py-0.5 rounded">
                        <Circle className={`w-2 h-2 fill-current ${inq.priority === 'high' ? 'text-rose-500' : inq.priority === 'medium' ? 'text-amber-500' : 'text-slate-400'}`} />
                        {inq.type?.replace('_', ' ')}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      <Building2 className="w-3 h-3" />
                      Property Inq
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border shadow-sm ${mode === 'support' ? (INQUIRY_STATUS as any)[inq.status]?.cls : (inq.status === 'unread' ? 'bg-amber-100 text-amber-700 border-amber-200' : inq.status === 'replied' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200')}`}
                  >
                    {inq.status === 'open' ? 'Needs Reply' : inq.status === 'in_progress' ? 'Working' : inq.status}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function Circle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

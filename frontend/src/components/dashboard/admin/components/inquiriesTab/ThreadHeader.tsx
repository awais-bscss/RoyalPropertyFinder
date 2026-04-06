"use client";

import { Mail, Phone, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThreadHeaderProps {
  activeInquiry: any;
  mode: "support" | "property";
  updating: boolean;
  handleStatusChange: (val: any) => void;
  handlePriorityChange: (val: any) => void;
  setShowDeleteModal: (v: boolean) => void;
  getAvatarBg: (name: string) => string;
  getInitials: (name: string) => string;
}

export function ThreadHeader({
  activeInquiry,
  mode,
  updating,
  handleStatusChange,
  handlePriorityChange,
  setShowDeleteModal,
  getAvatarBg,
  getInitials
}: ThreadHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full ${getAvatarBg(activeInquiry.senderName)} flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow-lg shadow-royal-500/10`}
        >
          {getInitials(activeInquiry.senderName)}
        </div>
        <div>
          <p className="text-[17px] font-black text-slate-900 dark:text-white leading-tight mb-1 uppercase tracking-tight">
            {activeInquiry.senderName}
          </p>
          <div className="flex items-center gap-3 text-[12px] font-bold text-slate-400">
            <span className="flex items-center gap-1 hover:text-royal-600 transition-colors">
              <Mail className="w-3.5 h-3.5" />
              {activeInquiry.senderEmail}
            </span>
            {activeInquiry.senderPhone && (
              <span className="flex items-center gap-1 pl-3 border-l border-slate-200 dark:border-slate-700 hover:text-emerald-600 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                {activeInquiry.senderPhone}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {activeInquiry.senderPhone && (
          <a 
            href={`https://wa.me/${activeInquiry.senderPhone.replace(/\D/g, "")}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-sm transition-all border border-emerald-100 shadow-sm"
            title="Discuss on WhatsApp"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        )}

        <Select
          value={activeInquiry.status}
          onValueChange={(val) => handleStatusChange(val as any)}
          disabled={updating}
        >
          <SelectTrigger className="h-9 w-auto min-w-[125px] text-[11px] font-black uppercase tracking-tight border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm focus:ring-1 focus:ring-royal-500 transition-all px-3">
            <SelectValue placeholder="Status" className="text-slate-950 dark:text-white" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            sideOffset={4}
            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 z-100"
          >
            {mode === 'support' ? (
              <>
                <SelectItem value="open" className="text-amber-600 font-bold uppercase tracking-tight text-[10px] focus:bg-amber-50">Needs Reply</SelectItem>
                <SelectItem value="in_progress" className="text-blue-600 font-bold uppercase tracking-tight text-[10px] focus:bg-blue-50">Working</SelectItem>
                <SelectItem value="resolved" className="text-emerald-600 font-bold uppercase tracking-tight text-[10px] focus:bg-emerald-50">Resolved</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="unread" className="text-amber-600 font-bold uppercase tracking-tight text-[10px] focus:bg-amber-50">Unread</SelectItem>
                <SelectItem value="read" className="text-slate-600 font-bold uppercase tracking-tight text-[10px] focus:bg-slate-50">Read</SelectItem>
                <SelectItem value="replied" className="text-blue-600 font-bold uppercase tracking-tight text-[10px] focus:bg-blue-50">Replied</SelectItem>
                <SelectItem value="archived" className="text-rose-600 font-bold uppercase tracking-tight text-[10px] focus:bg-rose-50">Archived</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>

        {mode === 'support' && (
          <Select
            value={activeInquiry.priority}
            onValueChange={(val) => handlePriorityChange(val as any)}
            disabled={updating}
          >
            <SelectTrigger className="h-9 w-auto min-w-[105px] text-[10px] font-black uppercase tracking-tight border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              className="text-[12px] font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            >
              <SelectItem value="low" className="text-slate-700 dark:text-slate-300 font-bold uppercase tracking-tight text-[10px]">Low</SelectItem>
              <SelectItem value="medium" className="text-amber-600 font-bold uppercase tracking-tight text-[10px]">Medium</SelectItem>
              <SelectItem value="high" className="text-rose-600 font-bold uppercase tracking-tight text-[10px]">High</SelectItem>
            </SelectContent>
          </Select>
        )}

        {mode === 'support' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-slate-400 hover:text-royal-600 dark:hover:text-royal-400 transition-colors rounded-full hover:bg-royal-50 dark:hover:bg-royal-900/20 cursor-pointer border-none shadow-none outline-none">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl border animate-in fade-in zoom-in-95 duration-100">
              <DropdownMenuLabel className="text-[9px] uppercase tracking-widest text-slate-400 font-black px-3 py-1.5 opacity-70">Support Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
              
              <DropdownMenuItem 
                onClick={() => {
                  navigator.clipboard.writeText(activeInquiry.senderEmail);
                  toast.success("Email copied to clipboard");
                }}
                className="group focus:bg-royal-50 dark:focus:bg-royal-500/10 px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest cursor-pointer flex items-center gap-2 outline-none transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-royal-600 transition-colors" />
                <span className="text-slate-600 dark:text-slate-400 group-focus:text-royal-600 transition-colors">Copy Email</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                onClick={() => {
                  navigator.clipboard.writeText(activeInquiry.senderPhone || "");
                  toast.success("Phone number copied");
                }}
                className="group focus:bg-royal-50 dark:focus:bg-royal-500/10 px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest cursor-pointer flex items-center gap-2 outline-none transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-royal-600 transition-colors" />
                <span className="text-slate-600 dark:text-slate-400 group-focus:text-royal-600 transition-colors">Copy Number</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
              
              <DropdownMenuItem 
                onClick={() => setShowDeleteModal(true)}
                className="group focus:bg-rose-50 dark:focus:bg-rose-500/10 px-3 py-2 font-black text-[10px] uppercase tracking-widest cursor-pointer flex items-center gap-2 outline-none transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600 transition-colors" />
                <span className="text-rose-600 group-focus:text-rose-700">Archive Inquiry</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {mode === 'property' && (
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer"
            title="Archive Property Inquiry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

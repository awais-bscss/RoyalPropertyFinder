"use client";

import { Paperclip, Loader2, Send, X } from "lucide-react";
import { useRef } from "react";

interface ReplyAreaProps {
  reply: string;
  setReply: (s: string) => void;
  sendingReply: boolean;
  attachments: File[];
  setAttachments: (files: any) => void;
  handleReply: () => void;
  mode: "support" | "property";
}

export function ReplyArea({
  reply,
  setReply,
  sendingReply,
  attachments,
  setAttachments,
  handleReply,
  mode
}: ReplyAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const availableSlots = 5 - attachments.length;
    if (files.length > 0) {
      setAttachments((prev: any) => [...prev, ...files.slice(0, availableSlots)]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev: any) => prev.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
      <div className="flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-sm hover:border-slate-300 dark:hover:border-slate-600 focus-within:ring-2 focus-within:ring-royal-600/20 focus-within:border-royal-600 transition-all duration-200">
        {attachments.length > 0 && (
          <div className="flex flex-col gap-1 mb-1">
            {attachments.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-sm border border-royal-200 dark:border-royal-800 text-[11px] shadow-sm">
                <div className="flex items-center gap-2 text-royal-600 font-bold truncate">
                  <Paperclip className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[200px]" title={file.name}>{file.name}</span>
                  <span className="text-slate-400 font-normal">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button 
                  onClick={() => removeAttachment(index)}
                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 transition-all cursor-pointer rounded-sm ${attachments.length > 0 ? "text-royal-600 bg-white shadow-sm ring-1 ring-royal-200" : "text-slate-400 hover:text-royal-600"}`}
            title="Attach files (Max 5)"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={mode === 'support' ? "Type your support message..." : "Type your property inquiry reply..."}
            className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none bg-white/30 focus:bg-white rounded px-3 transition-all text-[14px] font-sans font-medium resize-none py-1.5 scrollbar-thin max-h-[100px] overflow-y-auto dark:text-white"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
            }}
          />
          
          <button
            onClick={handleReply}
            disabled={sendingReply || !reply.trim()}
            className="shrink-0 flex items-center gap-2 bg-royal-600 hover:bg-royal-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-sm text-[12px] font-black uppercase tracking-widest shadow-lg shadow-royal-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {sendingReply ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>SEND</span>
          </button>
        </div>
      </div>
    </div>
  );
}

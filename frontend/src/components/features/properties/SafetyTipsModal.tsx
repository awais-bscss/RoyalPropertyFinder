"use client";

import { useEffect } from "react";
import { X, ShieldCheck, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SafetyTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SafetyTipsModal({ isOpen, onClose }: SafetyTipsModalProps) {
  const tips = [
    {
      title: "Never Pay Advance",
      description: "Do not pay any money for property inspections.",
      icon: <ShieldAlert className="text-rose-600" size={16} />,
    },
    {
      title: "Verification is Key",
      description: "Always verify property documents personally.",
      icon: <CheckCircle2 className="text-emerald-600" size={16} />,
    },
    {
       title: "Public Meetings",
       description: "Meet agents in official or public places.",
       icon: <ShieldCheck className="text-[#023E8A]" size={16} />,
    },
    {
       title: "Market Price",
       description: "Compare prices to spot unrealistic listings.",
       icon: <AlertTriangle className="text-amber-600" size={18} />,
    }
  ];

  // Stop background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.paddingRight = "12px";
      document.documentElement.style.paddingRight = "12px";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.paddingRight = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-6"
      onClick={handleBackdropClick}
      style={{ backgroundColor: "rgba(0,0,0,0.50)" }}
    >
      <div 
        className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-[440px] flex flex-col overflow-hidden"
        style={{ 
            animation: "rpf-modal-in 0.22s cubic-bezier(.4,0,.2,1)",
            maxHeight: "calc(100vh - 64px)"
        }}
      >
        {/* Close Button Matching LoginModal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto px-8 pb-8 pt-10 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-royal-100 dark:bg-royal-900/20 flex items-center justify-center text-royal-800 shrink-0">
                <ShieldCheck size={22} />
             </div>
             <div>
                <h3 className="font-extrabold text-xl text-slate-800 dark:text-white leading-tight">Safety Tips</h3>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Protect yourself</p>
             </div>
          </div>

          <div className="space-y-3">
             <div className="grid gap-2">
                {tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 transition-all">
                     <div className="w-7 h-7 rounded bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
                        {tip.icon}
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-700 dark:text-white text-[13px] leading-tight-compact">{tip.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight mt-0.5">{tip.description}</p>
                     </div>
                  </div>
                ))}
             </div>

             <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                <p className="text-[10px] text-amber-800 dark:text-amber-300 font-bold leading-relaxed text-center italic uppercase tracking-widest">
                  REPORT ANY SUSPICIOUS ACTIVITY!
                </p>
             </div>

             <button
               onClick={onClose}
               className="w-full bg-slate-100 hover:bg-royal-800 hover:text-white text-slate-600 font-bold rounded-lg py-3 text-sm transition-colors border border-slate-200 hover:border-royal-800 cursor-pointer shadow-sm"
             >
               I UNDERSTAND
             </button>
          </div>
        </div>

        <style jsx global>{`
          @keyframes rpf-modal-in {
            from { opacity: 0; transform: scale(0.95) translateY(-12px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}

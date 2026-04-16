"use client";

import { useState, useEffect } from "react";
import { X, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportService } from "@/services/report.service";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ReportListingModalProps {
  listingId: string;
  listingTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportListingModal({ listingId, listingTitle, isOpen, onClose }: ReportListingModalProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = [
    { id: "scam", label: "Fraud / Scam", description: "This listing is a scam." },
    { id: "misleading", label: "Misleading Info", description: "Incorrect price or location." },
    { id: "inappropriate", label: "Inappropriate Content", description: "Offensive text or images." },
    { id: "other", label: "Other", description: "Something else is wrong." },
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

  const handleSubmit = async () => {
    if (!isAuthenticated) return toast.error("Please login to report this listing");
    if (!reason) return toast.error("Please select a reason");

    setLoading(true);
    try {
      await ReportService.reportListing(listingId, { reason, description });
      toast.success("Report submitted successfully.");
      onClose();
    } catch (error) {
      toast.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="mb-6 text-center">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1">Report Listing</h3>
            <p className="text-xs text-slate-500 font-medium tracking-tight">Help us keep the platform safe.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Property</p>
               <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate">{listingTitle}</p>
            </div>

            <div className="grid gap-2">
              {reasons.map((r) => (
                <label 
                  key={r.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    reason === r.id 
                      ? "border-royal-800 bg-slate-50 dark:border-royal-400 dark:bg-royal-900/10" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <input 
                     type="radio" 
                     name="report_reason" 
                     className="mt-1 accent-royal-800"
                     checked={reason === r.id}
                     onChange={() => setReason(r.id)}
                  />
                  <div>
                    <p className="text-[13px] font-bold text-slate-700 dark:text-white leading-tight">{r.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{r.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[80px] p-4 text-sm text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-royal-800 focus:ring-1 focus:ring-royal-800 transition"
                placeholder="Details (optional)..."
              />
            </div>

            <button
               onClick={handleSubmit}
               disabled={loading || !reason}
               className={`w-full font-bold rounded-lg py-3 text-sm transition-colors border ${
                loading || !reason
                  ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-70"
                  : "bg-slate-100 hover:bg-royal-800 hover:text-white text-slate-600 border-slate-200 hover:border-royal-800 cursor-pointer shadow-sm"
              }`}
            >
              {loading ? "Submitting..." : "Send Report"}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes rpf-modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(-12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { X, Bell, Mail, Clock } from "lucide-react";

interface ManageAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageAlertsModal({ isOpen, onClose }: ManageAlertsModalProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState(true);

  // Disable background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "12px";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSave = () => {
    // Save logic here
    // e.g., AuthService.updateAlertPreferences({ emailAlerts, recentlyViewed })
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{ backgroundColor: "rgba(0,0,0,0.50)" }}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-[440px] overflow-hidden"
        style={{ animation: "rpf-modal-in 0.22s cubic-bezier(.4,0,.2,1)" }}
      >
        {/* Header content with close button */}
        <div className="px-7 pt-7 pb-4">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <Bell className="w-5 h-5 text-royal-800" />
            <h2 className="text-xl font-bold text-slate-800 leading-tight">
              Manage Alerts
            </h2>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Control which notifications you'd like to receive.
          </p>
        </div>

        {/* Content */}
        <div className="px-7 pb-8">
          <div className="space-y-4">
            {/* Email Recommendations */}
            <div
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-colors cursor-pointer ${
                emailAlerts
                  ? "border-royal-800 bg-royal-50/50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => setEmailAlerts(!emailAlerts)}
            >
              <div
                className={`mt-0.5 p-1.5 rounded-lg ${emailAlerts ? "bg-royal-800 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3
                  className={`text-[15px] font-bold ${emailAlerts ? "text-royal-900" : "text-slate-700"}`}
                >
                  Email Recommendations
                </h3>
                <p className="text-[13px] text-slate-500 font-medium leading-snug mt-0.5">
                  Get personalized property recommendations sent directly to
                  your inbox.
                </p>
              </div>
              <div className="pt-1">
                <div
                  className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${emailAlerts ? "bg-royal-800" : "bg-slate-200"}`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${emailAlerts ? "translate-x-5" : "translate-x-0"}`}
                  />
                </div>
              </div>
            </div>

            {/* Recently Viewed */}
            <div
              className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-colors cursor-pointer ${
                recentlyViewed
                  ? "border-royal-800 bg-royal-50/50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => setRecentlyViewed(!recentlyViewed)}
            >
              <div
                className={`mt-0.5 p-1.5 rounded-lg ${recentlyViewed ? "bg-royal-800 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3
                  className={`text-[15px] font-bold ${recentlyViewed ? "text-royal-900" : "text-slate-700"}`}
                >
                  Recently Viewed Properties
                </h3>
                <p className="text-[13px] text-slate-500 font-medium leading-snug mt-0.5">
                  Alerts for price drops or updates on properties you have
                  recently checked.
                </p>
              </div>
              <div className="pt-1">
                <div
                  className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${recentlyViewed ? "bg-royal-800" : "bg-slate-200"}`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${recentlyViewed ? "translate-x-5" : "translate-x-0"}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-6 bg-slate-100 hover:bg-royal-800 hover:text-white font-bold py-3 rounded-lg transition-colors cursor-pointer border border-royal-800 text-[15px] text-royal-800"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

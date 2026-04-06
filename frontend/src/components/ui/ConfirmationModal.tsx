"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger"
}: ConfirmationModalProps) {
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const variantStyles = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
      bg: "bg-rose-50 dark:bg-rose-500/10",
      btn: "bg-rose-600 hover:bg-rose-700 text-white"
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50 dark:bg-amber-500/10",
      btn: "bg-amber-600 hover:bg-amber-700 text-white"
    },
    info: {
      icon: <Loader2 className="w-6 h-6 text-royal-600" />,
      bg: "bg-royal-50 dark:bg-royal-500/10",
      btn: "bg-royal-600 hover:bg-royal-700 text-white"
    }
  };

  const style = variantStyles[variant];

  return (
    <div 
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all scale-100">
        
        {/* Header Icon & Close */}
        <div className="flex items-start justify-between p-5 pb-0">
          <div className={`p-3 rounded-full ${style.bg}`}>
            {style.icon}
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 pt-4">
          <h3 className="text-[18px] font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h3>
          <p className="mt-2 text-[14px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-5 pt-2 bg-slate-50/50 dark:bg-slate-800/20">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-[14px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-2 text-[14px] font-bold rounded-lg transition-shadow shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 ${style.btn}`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}

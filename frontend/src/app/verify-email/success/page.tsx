"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";

export default function VerificationSuccessPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* Background decorative elements matching brand style */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-royal-100/50 dark:bg-royal-900/10 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-royal-100/30 dark:bg-royal-900/10 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div 
        className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-[380px] mx-4 overflow-hidden"
        style={{ animation: "rpf-success-in 0.3s cubic-bezier(.4,0,.2,1)" }}
      >
        {/* Accent Header Line */}
        <div className="h-1 w-full bg-royal-800" />
        
        <div className="p-6 pt-10 text-center">
          {/* Success Icon */}
          <div className="mb-5 inline-flex items-center justify-center w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-full border border-emerald-100 dark:border-emerald-800/50">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>

          <h1 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight">
            Verified Successfully
          </h1>
          <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-6 leading-relaxed px-4">
            Confirmation complete. Your account is now fully active with all features unlocked.
          </p>

          {/* UNLOCKED FEATURES (Compact) */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-4 mb-6 text-left border border-slate-100 dark:border-slate-800">
            <ul className="space-y-2">
              {[
                "Post New Listings",
                "Contact Agents",
                "Manage Inquiries"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  <div className="w-1 h-1 bg-royal-800 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ACTION BUTTONS (Compact) */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full h-12 flex items-center justify-center gap-2 bg-royal-800 hover:bg-royal-900 text-white font-bold rounded-lg text-sm transition-all duration-200 group no-underline"
            >
              Go to Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/"
              className="w-full h-12 flex items-center justify-center gap-2 border border-royal-800 text-royal-800 dark:text-royal-400 font-bold rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 no-underline"
            >
              <Home size={16} />
              Return Home
            </Link>
          </div>

          <p className="mt-6 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Royal Property Finder &copy; 2026
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes rpf-success-in {
          from { opacity: 0; transform: scale(0.95) translateY(-12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

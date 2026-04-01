"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthService } from "@/services/auth.service";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await AuthService.resetPassword(token, { password, confirmPassword });
      toast.success("Password reset successful!");
      setIsSuccess(true);
    } catch (err: any) {
      // API error handling is automatic in Axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-[440px] mx-4 overflow-hidden p-8 pt-10 text-center"
          style={{ animation: "rpf-modal-in 0.22s cubic-bezier(.4,0,.2,1)" }}
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">Password Updated</h2>
          <p className="text-slate-500 text-sm mb-8">
            Your password has been successfully updated. You can now use your new credentials to sign in.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-slate-100 hover:bg-royal-800 hover:text-white text-slate-600 font-bold rounded-lg py-3 text-base transition-colors border border-slate-200 hover:border-royal-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-[440px] mx-4 overflow-hidden" 
        style={{ animation: "rpf-modal-in 0.22s cubic-bezier(.4,0,.2,1)" }}
      >
        <div className="p-8 pt-12">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-black text-slate-800 mb-2">Create New Password</h3>
            <p className="text-sm text-slate-500 font-medium">Please enter your new strong password.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Password */}
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password (min. 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-11 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-royal-800 focus:ring-1 focus:ring-royal-800 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-11 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-royal-800 focus:ring-1 focus:ring-royal-800 transition"
                required
              />
            </div>

            {/* Requirements Indicator */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-600 flex items-center gap-2 mb-2 font-medium">
                {/* Changed from div to span to resolve hydration error */}
                <span className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                At least 8 characters long
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                <span className={`w-2 h-2 rounded-full ${password === confirmPassword && password !== "" ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                Passwords must match
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-100 hover:bg-royal-800 hover:text-white text-slate-600 font-bold rounded-lg py-3 text-base transition-colors cursor-pointer mb-5 border border-slate-200 hover:border-royal-800 disabled:opacity-70"
            >
              {isSubmitting ? "Updating..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 text-sm font-bold text-royal-800 hover:underline cursor-pointer"
            >
              <ArrowLeft size={16} />
              Return to Login
            </button>
          </form>
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

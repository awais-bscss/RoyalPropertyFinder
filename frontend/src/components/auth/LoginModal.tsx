"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp?: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rpf_remember_me") === "true";
    }
    return false;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "12px";
      // Only clear fields if Remember Me is NOT active
      const remembered = localStorage.getItem("rpf_remember_me") === "true";
      if (!remembered) {
        setEmail("");
        setPassword("");
      }
      setRememberMe(remembered);
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

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center"
      onClick={handleBackdropClick}
      style={{ backgroundColor: "rgba(0,0,0,0.50)" }}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-[440px] mx-4 overflow-hidden"
        style={{ animation: "rpf-modal-in 0.22s cubic-bezier(.4,0,.2,1)" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors z-10 cursor-pointer"
          aria-label="Close login modal"
        >
          <X className="w-5 h-5" />
        </button>

        <form
          className="p-8 pt-12"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!email || !password) {
              toast.error("Please fill in all fields");
              return;
            }
            setIsSubmitting(true);
            try {
              // Persist the rememberMe preference before logging in
              if (rememberMe) {
                localStorage.setItem("rpf_remember_me", "true");
              } else {
                localStorage.removeItem("rpf_remember_me");
              }

              // Pass the rememberMe flag to the backend to control cookie life
              const response = await AuthService.login({
                email,
                password,
                rememberMe,
              });
              const user = response.data;

              toast.success(`Welcome back, ${user?.name || "User"}!`);

              dispatch(setAuth(user));
              onClose();
            } catch (err: any) {
              console.error("Login Details:", err);
              if (!err?.message) {
                toast.error(
                  "Login failed. Please check your connection or credentials.",
                );
              }
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {/* --- Facebook --- */}
          <a
            href="http://localhost:5000/api/v1/auth/facebook"
            className="w-full flex items-center justify-center gap-3 border border-royal-800 rounded-lg py-3 mb-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <FaFacebook size={22} className="text-[#1877F2]" />
            Continue with Facebook
          </a>

          {/* --- Google --- */}
          <a
            href="http://localhost:5000/api/v1/auth/google"
            className="w-full flex items-center justify-center gap-3 border border-royal-800 rounded-lg py-3 mb-6 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <FcGoogle size={22} />
            Continue with Google
          </a>

          {/* OR Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm font-bold text-slate-400 tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              autoComplete={rememberMe ? "username" : "off"}
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-royal-800 focus:ring-1 focus:ring-royal-800 transition"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-5 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete={rememberMe ? "current-password" : "off"}
              placeholder="Password*"
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
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-slate-100 hover:bg-royal-800 hover:text-white text-slate-600 font-bold rounded-lg py-3 text-base transition-colors cursor-pointer mb-5 border border-slate-200 hover:border-royal-800 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-royal-800 rounded cursor-pointer"
              />
              Remember Me
            </label>
            <button
              type="button"
              className="text-sm font-bold text-royal-800 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign Up Section */}
          <div className="text-center">
            <p className="text-sm font-bold text-slate-500 tracking-wider mb-4 uppercase">
              Are you new to Royal Property Finder?
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToSignUp?.();
              }}
              className="w-full border border-royal-800 text-royal-800 font-bold rounded-lg py-3 text-base hover:bg-royal-800 hover:text-white transition-colors cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes rpf-modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import { AuthService } from "@/services/auth.service";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignUpModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: SignUpModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string | undefined>("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.paddingRight = "12px";
      document.documentElement.style.paddingRight = "12px";
      // Clear fields on open to prevent stale data
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
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

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword || !phone) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please accept the Terms & Conditions to continue");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AuthService.register({
        name,
        email,
        password,
        phone,
        marketingEmails,
      });
      const user = response.data;
      toast.success(`Welcome to Royal Property Finder, ${user?.name || name}!`);
      dispatch(setAuth(user));
      onClose();
    } catch (err: any) {
      console.error("SignUp Details:", err);
      if (!err?.message) {
        toast.error("An unexpected error occurred during sign up.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center px-4 py-6"
      onClick={handleBackdropClick}
      style={{ backgroundColor: "rgba(0,0,0,0.50)" }}
    >
      {/* Modal shell — overflow:hidden clips children to rounded corners, scroll is on inner div */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-[440px] flex flex-col overflow-hidden"
        style={{
          animation: "rpf-modal-in 0.22s cubic-bezier(.4,0,.2,1)",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        {/* ── Sticky top bar (back + close) — never scrolls away ── */}
        <div className="relative flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          {/* Back to Login */}
          <button
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-royal-800 transition-colors cursor-pointer text-sm font-semibold"
            aria-label="Back to sign in"
          >
            <ChevronLeft className="w-4 h-4" />
            Sign In
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body — scroll happens INSIDE, radius stays on shell ── */}
        <form
          className="overflow-y-auto px-8 pb-8 pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignUp();
          }}
        >
          {/* Heading */}
          <h2 className="text-xl font-black text-slate-800 mb-1 tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Join Royal Property Finder today.
          </p>

          {/* Facebook */}
          <a
            href="http://localhost:5000/api/v1/auth/facebook"
            className="w-full flex items-center justify-center gap-3 border border-royal-800 rounded-lg py-3 mb-3 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <FaFacebook size={22} className="text-[#1877F2]" />
            Continue with Facebook
          </a>

          {/* Google */}
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

          {/* Full Name */}
          <div className="mb-3">
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Full Name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-royal-800 focus:ring-1 focus:ring-royal-800 transition"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              name="signup_email"
              autoComplete="email"
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-royal-800 focus:ring-1 focus:ring-royal-800 transition"
              required
            />
          </div>

          {/* Phone Number with country code */}
          <div className="mb-3">
            <div className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus-within:border-royal-800 focus-within:ring-1 focus-within:ring-royal-800 transition rpf-phone-wrapper">
              <PhoneInput
                placeholder="Phone Number*"
                value={phone}
                onChange={setPhone}
                defaultCountry="PK"
                international
                countryCallingCodeEditable={true}
                className="rpf-phone-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="mb-5 relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm Password*"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 pr-11 text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-royal-800 focus:ring-1 focus:ring-royal-800 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showConfirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 mb-6">
            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-royal-800 rounded cursor-pointer shrink-0"
              />
              <span>
                I agree to the{" "}
                <button
                  type="button"
                  className="font-bold text-royal-800 hover:underline cursor-pointer"
                >
                  Terms & Conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="font-bold text-royal-800 hover:underline cursor-pointer"
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Marketing */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none text-sm text-slate-600">
              <input
                type="checkbox"
                checked={marketingEmails}
                onChange={(e) => setMarketingEmails(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-royal-800 rounded cursor-pointer shrink-0"
              />
              <span>
                Send me property alerts, market updates, and exclusive offers
                via email
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !agreeTerms}
            className={`w-full font-bold rounded-lg py-3 text-base transition-colors border ${
              isSubmitting || !agreeTerms
                ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-70"
                : "bg-slate-100 hover:bg-royal-800 hover:text-white text-slate-600 border-slate-200 hover:border-royal-800 cursor-pointer"
            }`}
          >
            {isSubmitting ? "Creating account..." : "Continue"}
          </button>
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

        /* Phone input reset — match our input style exactly */
        .rpf-phone-input {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }
        .rpf-phone-input .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .rpf-phone-input .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
          border: 0;
          opacity: 0;
          cursor: pointer;
        }
        .rpf-phone-input .PhoneInputCountryIcon {
          width: 22px;
          height: 16px;
          border-radius: 2px;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .rpf-phone-input .PhoneInputCountrySelectArrow {
          width: 6px;
          height: 6px;
          border-color: #94a3b8;
          border-style: solid;
          border-top-width: 0;
          border-right-width: 2px;
          border-bottom-width: 2px;
          border-left-width: 0;
          transform: rotate(45deg);
          margin-top: -3px;
          margin-left: 2px;
          opacity: 0.6;
        }
        .rpf-phone-input .PhoneInputInput {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1rem;
          color: #1e293b;
          background: transparent;
          padding: 4px 0;
        }
        .rpf-phone-input .PhoneInputInput::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

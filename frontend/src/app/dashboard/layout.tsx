"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logoutAuth } from "@/store/slices/authSlice";
import { AuthService } from "@/services/auth.service";
import { toast } from "react-toastify";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success("Successfully logged out");
    } catch {
      toast.error("Logout completed with warnings");
    }
    dispatch(logoutAuth());
    router.push("/");
  };
  
  const [resending, setResending] = useState(false);
  const handleResend = async () => {
    setResending(true);
    try {
      await AuthService.resendVerification();
      toast.success("Verification email resent!");
    } catch (err: any) {
      // Handled by axios
    } finally {
      setResending(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-royal-800" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        handleLogout={handleLogout}
      />

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {user && !user.isEmailVerified && user.role !== "admin" && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800/40 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-50">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-[13px] font-bold">
              <AlertCircle size={16} />
              <span>Verify your email to unlock features like posting property listings.</span>
            </div>
            <button 
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-1.5 bg-amber-200 hover:bg-amber-300 dark:bg-amber-800/40 dark:hover:bg-amber-800/60 text-amber-900 dark:text-amber-100 px-4 py-1.5 rounded-sm text-[12px] font-extrabold transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCcw size={12} className={resending ? "animate-spin" : ""} />
              {resending ? "Resending Link..." : "Resend Verification Link"}
            </button>
          </div>
        )}
        <TopBar
          setSidebarOpen={setSidebarOpen}
          handleLogout={handleLogout}
          user={user}
        />

        {/* Nested Content rendered here */}
        <main className="flex-1 overflow-y-auto p-3 md:p-4">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

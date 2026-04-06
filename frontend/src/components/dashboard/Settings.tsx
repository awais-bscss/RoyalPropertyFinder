"use client";

import { useState, useEffect } from "react";
import { User, Lock, Bell, Shield, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { AuthService } from "@/services/auth.service";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

// Tab Components
import { ProfileTab } from "./settings/tabs/ProfileTab";
import { SecurityTab } from "./settings/tabs/SecurityTab";
import { NotificationsTab } from "./settings/tabs/NotificationsTab";
import { PrivacyTab } from "./settings/tabs/PrivacyTab";

const navItems = [
  { id: "profile", label: "Profile Details", icon: User },
  { id: "security", label: "Password & Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
];

export function Settings({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("profile");

  // --- Shared Session/Modal States for Security Tab ---
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    onConfirm: () => {},
    variant: "warning" as "danger" | "warning" | "info",
    loading: false
  });

  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  // --- Dynamic Fetching logic ---
  useEffect(() => {
    if (activeTab === "security") {
      fetchSessions();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const res: any = await AuthService.getSessions();
      if (res.success) {
        setSessions(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch sessions");
    } finally {
      setLoadingSessions(false);
    }
  };

  // --- Modal Triggers (to pass to SecurityTab) ---
  const handleRevokeSession = async (sessionId: string) => {
    closeConfirm();
    try {
      const res: any = await AuthService.revokeSession(sessionId);
      if (res.success) {
        toast.success("Session revoked successfully.");
        setSessions(sessions.map(s => s.id === sessionId ? { ...s, status: 'revoked', revokedAt: new Date().toISOString() } : s));
      }
    } catch (err) {
      console.error("Failed to revoke session");
    }
  };

  const triggerRevokeSession = (sessionId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Log Out This Device?",
      message: "This will instantly terminate the session on this device. You will need to log in again to regain access. Continue?",
      confirmText: "Log Out Device",
      variant: "warning",
      onConfirm: () => handleRevokeSession(sessionId),
      loading: false
    });
  };

  const handleRevokeAllSessions = async () => {
    closeConfirm();
    setIsRevokingAll(true);
    try {
      const res: any = await AuthService.revokeAllSessions();
      if (res.success) {
        toast.success("All other sessions have been logged out.");
        setSessions(sessions.map(s => s.current ? s : { ...s, status: 'revoked', revokedAt: new Date().toISOString() }));
      }
    } catch (err) {
      console.error("Failed to revoke all sessions");
    } finally {
      setIsRevokingAll(false);
    }
  };

  const triggerRevokeAll = () => {
    setConfirmModal({
      isOpen: true,
      title: "Sign Out All Other Devices?",
      message: "This will instantly log out every device currently signed into your account except for this one. Are you sure?",
      confirmText: "Sign Out All Devices",
      variant: "danger",
      onConfirm: handleRevokeAllSessions,
      loading: false
    });
  };

  const handleClearHistory = async () => {
    closeConfirm();
    setIsClearingHistory(true);
    try {
      const res: any = await AuthService.clearHistory();
      if (res.success) {
        toast.success("Login history cleared.");
        setSessions(sessions.filter(s => s.status === 'active'));
      }
    } catch (err) {
      console.error("Failed to clear history");
    } finally {
      setIsClearingHistory(false);
    }
  };

  const triggerClearHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: "Clear Entire Log History?",
      message: "This will permanently delete the history of all logged-out devices. This action cannot be undone.",
      confirmText: "Clear All History",
      variant: "danger",
      onConfirm: handleClearHistory,
      loading: false
    });
  };

  const handleDeleteHistory = async (sessionId: string) => {
    closeConfirm();
    try {
      const res: any = await AuthService.deleteSessionHistory(sessionId);
      if (res.success) {
        setSessions(sessions.filter(s => s.id !== sessionId));
      }
    } catch (err) {
      console.error("Failed to delete history entry");
    }
  };

  const triggerDeleteHistoryEntry = (sessionId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete History Entry?",
      message: "Are you sure you want to remove this log from your history?",
      confirmText: "Delete",
      variant: "warning",
      onConfirm: () => handleDeleteHistory(sessionId),
      loading: false
    });
  };

  const handleDeactivate = async () => {
    closeConfirm();
    try {
      const res = await AuthService.deactivateAccount();
      if (res.success) {
        toast.success("Account deactivated successfully. Redirecting...");
        setTimeout(() => (window.location.href = "/"), 2000);
      }
    } catch (err) {}
  };

  const triggerDeactivate = () => {
    setConfirmModal({
      isOpen: true,
      title: "Deactivate Account?",
      message: "Your profile and listings will be hidden from everyone. You can reactivate by contacting support later. Are you sure?",
      confirmText: "Deactivate Now",
      variant: "warning",
      onConfirm: handleDeactivate,
      loading: false
    });
  };

  const handleDeleteAccount = async () => {
    closeConfirm();
    try {
      const res = await AuthService.deleteAccount();
      if (res.success) {
        toast.success("Account deleted permanently. Redirecting...");
        setTimeout(() => (window.location.href = "/"), 2000);
      }
    } catch (err) {}
  };

  const triggerDeleteAccount = () => {
    setConfirmModal({
      isOpen: true,
      title: "DELETE PERMANENTLY?",
      message: "This will erase all your listings, profile data, and history forever. This cannot be undone. Are you absolutely sure?",
      confirmText: "Delete Account",
      variant: "danger",
      onConfirm: handleDeleteAccount,
      loading: false
    });
  };

  return (
    <div className="flex gap-5 h-full">
      {/* ── Left Nav Rail ─────────────────────────────────────────────── */}
      <div className="w-[230px] shrink-0 sticky top-0 self-start">
        <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[16px] font-bold text-slate-900 dark:text-white">Settings</p>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">Manage your account</p>
          </div>
          <nav className="p-2 space-y-0.5">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[14.5px] transition-all duration-150 cursor-pointer group ${
                    active
                      ? "bg-[#daf1f5] dark:bg-royal-500/20 text-royal-700 dark:text-royal-300 font-semibold"
                      : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 font-medium hover:text-slate-800 hover:dark:text-white/90"
                  }`}
                >
                  <Icon className="w-[17px] h-[17px] shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Right Content Area ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 pb-10">
        {activeTab === "profile" && <ProfileTab user={user} />}
        {activeTab === "security" && (
          <SecurityTab 
            user={user}
            sessions={sessions}
            loadingSessions={loadingSessions}
            isRevokingAll={isRevokingAll}
            isClearingHistory={isClearingHistory}
            triggerRevokeAll={triggerRevokeAll}
            triggerClearHistory={triggerClearHistory}
            triggerRevokeSession={triggerRevokeSession}
            triggerDeleteHistoryEntry={triggerDeleteHistoryEntry}
          />
        )}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "privacy" && (
          <PrivacyTab
            triggerRevokeAll={triggerRevokeAll}
            triggerDeactivate={triggerDeactivate}
            triggerDeleteAccount={triggerDeleteAccount}
          />
        )}
      </div>

      {/* Persistence Controls */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
        isLoading={confirmModal.loading || isRevokingAll || isClearingHistory}
      />
    </div>
  );
}

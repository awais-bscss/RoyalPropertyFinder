"use client";

import { useState, useEffect } from "react";
import { Loader2, Key, Smartphone, Globe, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { AuthService } from "@/services/auth.service";
import { SettingsCard } from "../components/SettingsCard";
import { Field } from "../components/Inputs";
import { PasswordInput } from "../components/PasswordInput";

interface SecurityTabProps {
  user: any;
  triggerRevokeAll: () => void;
  triggerClearHistory: () => void;
  triggerRevokeSession: (id: string) => void;
  triggerDeleteHistoryEntry: (id: string) => void;
  sessions: any[];
  loadingSessions: boolean;
  isRevokingAll: boolean;
  isClearingHistory: boolean;
}

export function SecurityTab({
  user,
  triggerRevokeAll,
  triggerClearHistory,
  triggerRevokeSession,
  triggerDeleteHistoryEntry,
  sessions,
  loadingSessions,
  isRevokingAll,
  isClearingHistory,
}: SecurityTabProps) {
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      await AuthService.updatePassword({
        currentPassword,
        password: newPassword,
        confirmPassword,
      });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleForgotCurrentPassword = async () => {
    if (!user?.email) return;
    try {
      toast.info("Requesting reset link...");
      await AuthService.forgotPassword(user.email);
      toast.success("Reset link sent! Please check your email inbox to create a new password.");
    } catch (err: any) {}
  };

  return (
    <div className="space-y-4">
      {/* Change Password */}
      <form onSubmit={handlePasswordUpdate}>
        <SettingsCard
          title="Change Password"
          description="Use a strong password that you don't use anywhere else."
          footer={
            <button type="submit" disabled={isUpdatingPassword} className="flex items-center gap-1.5 bg-royal-600 hover:bg-royal-700 text-white text-[14px] font-bold px-5 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-70 shadow-sm">
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          }
        >
          <div className="space-y-4 max-w-md">
            <Field label="Current Password">
              <PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
              <button 
                type="button" 
                onClick={handleForgotCurrentPassword}
                className="text-xs font-bold text-royal-600 dark:text-royal-400 hover:underline mt-2 inline-block cursor-pointer"
              >
                Forgot current password?
              </button>
            </Field>
            <Field label="New Password">
              <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Create a strong password" />
            </Field>
            <Field label="Confirm New Password">
              <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
            </Field>
          </div>
        </SettingsCard>
      </form>

      {/* Active Sessions */}
      <SettingsCard
        title="Active Sessions"
        description="Devices currently logged into your account."
        footer={
          (sessions.length > 1 || sessions.some(s => s.status === 'revoked')) && (
            <div className="flex items-center gap-3">
              {sessions.some(s => s.status === 'revoked') && (
                <button 
                  onClick={triggerClearHistory}
                  disabled={isClearingHistory}
                  className="text-[12px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isClearingHistory ? "Clearing..." : "Clear Login History"}
                </button>
              )}
              {sessions.filter(s => s.status === 'active').length > 1 && (
                <button 
                  onClick={triggerRevokeAll}
                  disabled={isRevokingAll}
                  className="text-[13px] font-bold text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-200 dark:border-rose-500/30 px-4 py-2 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isRevokingAll ? "Signing out..." : "Sign Out All Other Devices"}
                </button>
              )}
            </div>
          )
        }
      >
        {loadingSessions ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-royal-500" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-[14px]">No active sessions found.</div>
        ) : (
          sessions.map((s) => {
            const isRevoked = s.status === 'revoked';
            const startedDate = new Date(s.createdAt);
            const revokedDate = s.revokedAt ? new Date(s.revokedAt) : null;
            const now = new Date();
            
            let timeDisplay = "";
            if (isRevoked && revokedDate) {
              const lifespanMins = Math.floor((revokedDate.getTime() - startedDate.getTime()) / 60000);
              const lifespanDisplay = lifespanMins < 1 ? "less than a min" : lifespanMins < 60 ? `${lifespanMins} mins` : `${Math.floor(lifespanMins/60)} hours`;
              const agoMins = Math.floor((now.getTime() - revokedDate.getTime()) / 60000);
              const agoDisplay = agoMins < 1 ? "just now" : agoMins < 60 ? `${agoMins} mins ago` : `${Math.floor(agoMins/60)} hours ago`;
              timeDisplay = `Was active for ${lifespanDisplay} • Logged out ${agoDisplay}`;
            } else {
              const diffInMins = Math.floor((now.getTime() - startedDate.getTime()) / 60000);
              const activeTime = diffInMins < 1 ? "Just now" : diffInMins < 60 ? `${diffInMins} mins` : diffInMins < 1440 ? `${Math.floor(diffInMins/60)} hours` : `${Math.floor(diffInMins/1440)} days`;
              timeDisplay = `Active for ${activeTime}`;
            }

            return (
              <div
                key={s.id}
                className={`flex items-start justify-between p-4 rounded-lg mb-3 transition-all ${
                  s.current 
                    ? 'bg-emerald-50/80 border-2 border-emerald-200 shadow-sm dark:bg-emerald-500/10 dark:border-emerald-500/30' 
                    : isRevoked
                      ? 'bg-slate-50/50 dark:bg-slate-800/10 border border-transparent opacity-60 grayscale-[0.4]'
                      : 'bg-transparent border-b border-slate-100 dark:border-slate-800 last:border-0'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative mt-1">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border transition-colors ${s.current ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                      {s.device?.toLowerCase().includes("mobile") ? (
                        <Smartphone className={`w-5 h-5 ${s.current ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`} />
                      ) : (
                        <Globe className={`w-5 h-5 ${s.current ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`} />
                      )}
                    </div>
                    {!isRevoked && (
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0B1120] ${s.current ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-[15px] font-bold ${s.current ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {s.device || "Unknown Device"}
                      </p>
                      {s.current && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-2.5 py-0.5 rounded-sm">
                          This Device
                        </span>
                      )}
                      {isRevoked && (
                        <span className="text-[10px] uppercase tracking-wider font-extrabold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 px-2.5 py-0.5 rounded-sm">
                          Logged Out
                        </span>
                      )}
                    </div>

                    <div className="text-[13px] font-medium text-slate-500 mt-1.5 space-y-1">
                      <p className="flex items-center gap-1.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        {s.loc || "Unknown Location"}
                      </p>
                      <p className="flex items-center gap-1.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        Started: {startedDate.toLocaleDateString()} at {startedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="flex items-center gap-1.5 leading-relaxed">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.current ? 'bg-emerald-400 dark:bg-emerald-500' : isRevoked ? 'bg-slate-400' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                        <span className={s.current ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>{timeDisplay}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {!s.current && !isRevoked && (
                  <button 
                    onClick={() => triggerRevokeSession(s.id)}
                    className="text-[13px] font-bold text-rose-600 dark:text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-200 dark:border-rose-500/30 px-3 py-1.5 rounded-sm transition-colors cursor-pointer mt-1 whitespace-nowrap shadow-sm"
                  >
                    Log Out Device
                  </button>
                )}
                
                {isRevoked && (
                  <div className="flex items-center gap-3 mt-1">
                    <div className="text-[12px] font-bold text-slate-400 italic">
                      Session Ended
                    </div>
                    <button 
                      onClick={() => triggerDeleteHistoryEntry(s.id)}
                      className="p-1.5 rounded-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-300 hover:text-rose-600 transition-colors cursor-pointer outline-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </SettingsCard>
    </div>
  );
}

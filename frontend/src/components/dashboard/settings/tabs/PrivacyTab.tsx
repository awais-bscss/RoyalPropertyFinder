"use client";

import { LogOut, AlertTriangle, Trash2 } from "lucide-react";
import { SettingsCard } from "../components/SettingsCard";
import { ToggleRow } from "../components/ToggleRow";

export function PrivacyTab({
  triggerRevokeAll,
  triggerDeactivate,
  triggerDeleteAccount,
}: {
  triggerRevokeAll: () => void;
  triggerDeactivate: () => void;
  triggerDeleteAccount: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Visibility */}
      <SettingsCard
        title="Profile Visibility"
        description="Control what other users can see about you."
      >
        <ToggleRow
          title="Show Phone Number Publicly"
          desc="Display your phone on listings so buyers can call directly."
          defaultChecked={true}
        />
        <ToggleRow
          title="Show Profile to Search Engines"
          desc="Allow Google and others to index your agent profile."
          defaultChecked={false}
        />
        <ToggleRow
          title="Show Online Status"
          desc="Let buyers see when you were last active."
          defaultChecked={true}
        />
      </SettingsCard>

      {/* Data & Account */}
      <SettingsCard
        title="Data & Account"
        description="Manage your data and account lifecycle."
      >
        {/* Sign Out All */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors px-2 -mx-2 rounded-sm group">
          <div className="flex items-start gap-4 pr-4">
            <div className="w-10 h-10 rounded-sm bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-slate-900 dark:text-white">Sign Out All Devices</p>
              <p className="text-[14px] font-medium text-slate-500 mt-1 leading-relaxed">Immediately revoke all active sessions across your devices.</p>
            </div>
          </div>
          <button 
            onClick={triggerRevokeAll}
            className="text-[14px] font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 px-5 py-2.5 rounded-sm hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 transition-all cursor-pointer whitespace-nowrap shadow-sm shadow-rose-500/5 group-hover:border-rose-300"
          >
            Sign Out All
          </button>
        </div>

        {/* Deactivate */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors px-2 -mx-2 rounded-sm group">
          <div className="flex items-start gap-4 pr-4">
            <div className="w-10 h-10 rounded-sm bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-slate-900 dark:text-white">Deactivate Account</p>
              <p className="text-[14px] font-medium text-slate-500 mt-1 leading-relaxed">Temporarily hide your profile and listings from the platform.</p>
            </div>
          </div>
          <button 
            onClick={triggerDeactivate}
            className="text-[14px] font-bold text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 px-5 py-2.5 rounded-sm hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 transition-all cursor-pointer whitespace-nowrap shadow-sm shadow-amber-500/5 group-hover:border-amber-300"
          >
            Deactivate
          </button>
        </div>

        {/* Delete */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors px-2 -mx-2 rounded-sm group">
          <div className="flex items-start gap-4 pr-4">
            <div className="w-10 h-10 rounded-sm bg-rose-600 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[16px] font-bold text-slate-900 dark:text-white">Delete Account</p>
              <p className="text-[14px] font-medium text-slate-500 mt-1 leading-relaxed">Permanently delete your account and all associated data. Irreversible.</p>
            </div>
          </div>
          <button 
            onClick={triggerDeleteAccount}
            className="text-[14px] font-bold text-white bg-rose-600 border border-rose-600 px-5 py-2.5 rounded-sm hover:bg-rose-700 hover:border-rose-700 transition-all cursor-pointer whitespace-nowrap shadow-md shadow-rose-500/20"
          >
            Delete Account
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}

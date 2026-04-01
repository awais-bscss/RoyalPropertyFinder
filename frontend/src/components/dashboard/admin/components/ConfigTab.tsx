"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, Save, Server, Shield, Sliders } from "lucide-react";

export function ConfigTab() {
  const [loading, setLoading] = useState(false);

  // Simulated initial config
  const [config, setConfig] = useState({
    siteName: "Royal Property Finder",
    supportEmail: "support@royalproperty.com",
    supportPhone: "+92 300 1234567",
    currency: "PKR",
    maintenanceMode: false,
    autoApproveAgents: true,
    maxImagesPerListing: 15,
    allowRegistrations: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Platform configuration updated successfully");
      setLoading(false);
    }, 800);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Platform Details Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-royal-100 text-royal-700 flex items-center justify-center shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">
              General Identity
            </h3>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Public contact info and basic platform identifying details.
            </p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
              Platform Name
            </label>
            <input
              type="text"
              value={config.siteName}
              onChange={(e) =>
                setConfig({ ...config, siteName: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-royal-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
              Default Currency
            </label>
            <select
              value={config.currency}
              onChange={(e) =>
                setConfig({ ...config, currency: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-royal-400 appearance-none"
            >
              <option value="PKR">PKR (Pakistani Rupee)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="AED">AED (Emirati Dirham)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
              Support Email
            </label>
            <input
              type="email"
              value={config.supportEmail}
              onChange={(e) =>
                setConfig({ ...config, supportEmail: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-royal-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
              Support Phone
            </label>
            <input
              type="text"
              value={config.supportPhone}
              onChange={(e) =>
                setConfig({ ...config, supportPhone: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-royal-400"
            />
          </div>
        </div>
      </div>

      {/* Listing Rules Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">
              Listing Operations & Media
            </h3>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Control constraints and approval pipelines for user listings.
            </p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20">
            <div>
              <p className="text-[13px] font-bold text-slate-900 dark:text-white">
                Auto-Approve Verified Agents
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                If enabled, listings from users with the "Agent" role bypass the
                manual pending queue.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setConfig({
                  ...config,
                  autoApproveAgents: !config.autoApproveAgents,
                })
              }
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${config.autoApproveAgents ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.autoApproveAgents ? "translate-x-2" : "-translate-x-2"}`}
              />
            </button>
          </div>

          <div className="space-y-1.5 px-4 pt-2">
            <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
              Max Images Per Listing
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={config.maxImagesPerListing}
              onChange={(e) =>
                setConfig({
                  ...config,
                  maxImagesPerListing: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-royal-400"
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 p-5 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">
              Security & Access
            </h3>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Highest-level controls for platform availability.
            </p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20">
            <div>
              <p className="text-[13px] font-bold text-slate-900 dark:text-white">
                Allow New Registrations
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                If turned off, the sign up form will be globally disabled.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setConfig({
                  ...config,
                  allowRegistrations: !config.allowRegistrations,
                })
              }
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${config.allowRegistrations ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.allowRegistrations ? "translate-x-2" : "-translate-x-2"}`}
              />
            </button>
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10">
            <div>
              <p className="text-[13px] font-bold text-rose-900 dark:text-rose-400">
                Maintenance Mode
              </p>
              <p className="text-[11px] text-rose-700 dark:text-rose-500 mt-1">
                Turns off the entire site and renders a "Be right back" landing
                page for users.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setConfig({
                  ...config,
                  maintenanceMode: !config.maintenanceMode,
                })
              }
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${config.maintenanceMode ? "bg-rose-500" : "bg-slate-200 dark:bg-slate-700"}`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.maintenanceMode ? "translate-x-2" : "-translate-x-2"}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-royal-600 hover:bg-royal-700 text-white text-[13px] font-bold shadow-md shadow-royal-500/20 transition-all cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Configuration
        </button>
      </div>
    </form>
  );
}

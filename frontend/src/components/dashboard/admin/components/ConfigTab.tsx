"use client";

import React, { useState, useEffect } from "react";
import { Save, Mail, Phone, MapPin, Loader2, Settings, ChevronRight, Facebook, Instagram, Youtube, Twitter, Linkedin, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import SettingsService, { ISettings } from "@/services/settings.service";
import { SettingsCard } from "../../settings/components/SettingsCard";
import { Field, TextInput } from "../../settings/components/Inputs";

export function ConfigTab() {
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
    linkedin: "",
  });

  const [activeSubTab, setActiveSubTab] = useState("general");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await SettingsService.getSettings();
        if (res.success) {
          setSettings(res.data);
          setFormData({
            contactEmail: res.data.contactEmail,
            contactPhone: res.data.contactPhone,
            contactAddress: res.data.contactAddress,
            facebook: res.data.facebook || "",
            instagram: res.data.instagram || "",
            youtube: res.data.youtube || "",
            twitter: res.data.twitter || "",
            linkedin: res.data.linkedin || "",
          });
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await SettingsService.updateSettings(formData);
      if (res.success) {
        setSettings(res.data);
        toast.success("Settings saved successfully");
      }
    } catch (err) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-royal-600" />
      </div>
    );
  }

  return (
    <div className="flex gap-5 h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* ── Left Nav Rail ── */}
      <div className="w-[230px] shrink-0 sticky top-0 self-start">
        <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[16px] font-bold text-slate-900 dark:text-white uppercase tracking-tight">System Config</p>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">Platform Defaults</p>
          </div>
          <nav className="p-2 space-y-0.5">
            <button
              onClick={() => setActiveSubTab("general")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[14.5px] transition-all duration-150 cursor-pointer group ${
                activeSubTab === "general"
                  ? "bg-[#daf1f5] dark:bg-royal-500/20 text-royal-700 dark:text-royal-300 font-semibold"
                  : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 font-medium hover:text-slate-800 hover:dark:text-white/90"
              }`}
            >
              <Settings className="w-[17px] h-[17px] shrink-0" />
              <span className="flex-1 truncate">Contact Info</span>
              {activeSubTab === "general" && <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" />}
            </button>
            <button
              onClick={() => setActiveSubTab("social")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[14.5px] transition-all duration-150 cursor-pointer group ${
                activeSubTab === "social"
                  ? "bg-[#daf1f5] dark:bg-royal-500/20 text-royal-700 dark:text-royal-300 font-semibold"
                  : "text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5 font-medium hover:text-slate-800 hover:dark:text-white/90"
              }`}
            >
              <Share2 className="w-[17px] h-[17px] shrink-0" />
              <span className="flex-1 truncate">Brand & Social</span>
              {activeSubTab === "social" && <ChevronRight className="w-3.5 h-3.5 ml-auto shrink-0" />}
            </button>
          </nav>
        </div>
      </div>

      {/* ── Right Content Area ── */}
      <div className="flex-1 min-w-0 pb-10">
        <form onSubmit={handleUpdate} className="space-y-4">
          {activeSubTab === "general" && (
            <SettingsCard
              title="Global Contact Details"
              description="Manage the email, phone and address shown across the platform and contact page."
              footer={
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-royal-600 hover:bg-royal-700 text-white text-[14px] font-bold px-5 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-75 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Configuration
                    </>
                  )}
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Contact Email" hint="Public email for support inquiries.">
                  <TextInput
                    icon={Mail}
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="support@royalproperty.com"
                  />
                </Field>
                <Field label="Contact Phone" hint="Primary company phone number.">
                  <TextInput
                    icon={Phone}
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+92 300 1234567"
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Office Address" hint="Full address shown on contact page.">
                    <div className="relative group">
                      <div className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-royal-500 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <textarea
                        rows={3}
                        value={formData.contactAddress}
                        onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-sm font-bold text-[14px] text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-royal-500 outline-none transition-all resize-none placeholder:text-slate-400 font-medium"
                        placeholder="Enter complete office address..."
                        required
                      />
                    </div>
                  </Field>
                </div>
              </div>
            </SettingsCard>
          )}

          {activeSubTab === "social" && (
            <SettingsCard
              title="Social Brand Reach"
              description="Manage your social media presence across the headers and footer of the platform."
              footer={
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-royal-600 hover:bg-royal-700 text-white text-[14px] font-bold px-5 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-75 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Social Links
                    </>
                  )}
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Facebook Profile" hint="Link to company Facebook page.">
                  <TextInput
                    icon={Facebook}
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    placeholder="https://facebook.com/your-brand"
                  />
                </Field>
                <Field label="Instagram Handle" hint="Instagram business profile link.">
                  <TextInput
                    icon={Instagram}
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/your-brand"
                  />
                </Field>
                <Field label="YouTube Channel" hint="Official YouTube channel URL.">
                  <TextInput
                    icon={Youtube}
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    placeholder="https://youtube.com/c/your-brand"
                  />
                </Field>
                <Field label="Twitter / X" hint="Twitter profile URL.">
                  <TextInput
                    icon={Twitter}
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="https://twitter.com/your-brand"
                  />
                </Field>
                <Field label="LinkedIn Page" hint="Company LinkedIn page URL.">
                  <TextInput
                    icon={Linkedin}
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/your-brand"
                  />
                </Field>
              </div>
            </SettingsCard>
          )}

          {/* Sync Stats Info */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-sm">
             <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-4">Sync Statistics</h3>
             <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span>Live Sync Active</span>
             </div>
             <p className="text-[12px] text-slate-500 mt-2 font-medium">
               Last configuration update: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString() : "Never"}
             </p>
          </div>
        </form>
      </div>
    </div>
  );
}

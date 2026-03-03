"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Shield,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronRight,
  AlertTriangle,
  Smartphone,
  Mail,
  MapPin,
  Phone,
  Globe,
  Trash2,
  LogOut,
  Key,
} from "lucide-react";

// ── Nav Items ─────────────────────────────────────────────────────────────────
const navItems = [
  { id: "profile", label: "Profile Details", icon: User },
  { id: "security", label: "Password & Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
];

// ── Reusable Input ────────────────────────────────────────────────────────────
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({
  type = "text",
  placeholder,
  defaultValue,
  disabled,
  icon: Icon,
}: {
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  icon?: any;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      )}
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        disabled={disabled}
        className={`w-full ${Icon ? "pl-9" : "pl-3.5"} pr-3.5 py-2.5 text-[13px] rounded-sm border
          border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900
          text-slate-700 dark:text-slate-200 placeholder:text-slate-400
          focus:outline-none focus:border-royal-500 transition-colors
          disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:cursor-not-allowed disabled:text-slate-400`}
      />
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────
function Card({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
        <p className="text-[16px] font-bold text-slate-900 dark:text-white">
          {title}
        </p>
        {description && (
          <p className="text-[13px] font-medium text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>
      {/* Card Body */}
      <div className="p-5">{children}</div>
      {/* Card Footer */}
      {footer && (
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex justify-end gap-2">
          {footer}
        </div>
      )}
    </div>
  );
}

// ── Toggle Row ────────────────────────────────────────────────────────────────
function ToggleRow({
  title,
  desc,
  defaultChecked,
}: {
  title: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <p className="text-[16px] font-bold text-slate-900 dark:text-white">
          {title}
        </p>
        <p className="text-[14px] font-medium text-slate-500 mt-1">{desc}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative shrink-0 inline-flex h-6 w-[42px] items-center rounded-full transition-colors cursor-pointer ${
          checked ? "bg-royal-600" : "bg-slate-200 dark:bg-slate-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-[4px]"
          }`}
        />
      </button>
    </div>
  );
}

// ── Password Input ────────────────────────────────────────────────────────────
function PasswordInput({ placeholder }: { placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder ?? "••••••••"}
        className="w-full pl-9 pr-10 py-2.5 text-[13px] rounded-sm border border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 placeholder:text-slate-400
          focus:outline-none focus:border-royal-500 transition-colors"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        {show ? (
          <EyeOff className="w-3.5 h-3.5" />
        ) : (
          <Eye className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

// ── Danger Button ─────────────────────────────────────────────────────────────
function DangerRow({
  icon: Icon,
  label,
  desc,
}: {
  icon: any;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-sm bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <p className="text-[16px] font-bold text-slate-900 dark:text-white">
            {label}
          </p>
          <p className="text-[14px] font-medium text-slate-500 mt-1">{desc}</p>
        </div>
      </div>
      <button className="text-[14px] font-bold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 px-5 py-2.5 rounded-sm hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer whitespace-nowrap">
        {label}
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function Settings({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex gap-5 h-full">
      {/* ── Left Nav Rail ─────────────────────────────────────────────── */}
      <div className="w-[230px] shrink-0 sticky top-0 self-start">
        <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Nav Header */}
          <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[16px] font-bold text-slate-900 dark:text-white">
              Settings
            </p>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">
              Manage your account
            </p>
          </div>
          {/* Nav Items */}
          <nav className="p-2 space-y-0.5">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left
                    text-[15px] transition-all duration-150 cursor-pointer group
                    ${
                      active
                        ? "bg-[#daf1f5] dark:bg-royal-500/20 text-royal-700 dark:text-royal-300 font-bold"
                        : "text-slate-600 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/5 font-semibold hover:text-slate-800 hover:dark:text-white/90"
                    }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {active && <ChevronRight className="w-5 h-5 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Right Content ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* ════ PROFILE TAB ════════════════════════════════════════════ */}
        {activeTab === "profile" && (
          <>
            {/* Avatar Card */}
            <Card
              title="Profile Photo"
              description="This is shown publicly on your listings and messages."
              footer={
                <button className="flex items-center gap-2 bg-royal-600 hover:bg-royal-700 text-white text-[14px] font-bold px-5 py-2.5 rounded-sm transition-colors cursor-pointer">
                  <Camera className="w-4 h-4" /> Upload Photo
                </button>
              }
            >
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-sm bg-royal-100 dark:bg-royal-900/30 border border-royal-200 dark:border-royal-800/40 flex items-center justify-center text-royal-700 dark:text-royal-400 font-bold text-2xl uppercase overflow-hidden">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.[0] || "U"
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-royal-600 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-[16px] font-bold text-slate-900 dark:text-white capitalize">
                    {user?.name || "Your Name"}
                  </p>
                  <p className="text-[13px] font-medium text-slate-500 mt-1">
                    {user?.email}
                  </p>
                  <p className="text-[12px] text-slate-500 mt-2">
                    JPG, PNG or GIF · Max 2 MB
                  </p>
                </div>
              </div>
            </Card>

            {/* Personal Info Card */}
            <Card
              title="Personal Information"
              description="Your name and contact details visible to other users."
              footer={
                <button className="flex items-center gap-1.5 bg-royal-600 hover:bg-royal-700 text-white text-[14px] font-bold px-5 py-2.5 rounded-sm transition-colors cursor-pointer">
                  Save Changes
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <TextInput
                    icon={User}
                    defaultValue={user?.name}
                    placeholder="Your full name"
                  />
                </Field>
                <Field label="Email Address" hint="">
                  <div>
                    <TextInput
                      icon={Mail}
                      type="email"
                      defaultValue={user?.email}
                      disabled
                    />
                    <p className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Verified email
                      address
                    </p>
                  </div>
                </Field>
                <Field label="Phone Number">
                  <TextInput
                    icon={Phone}
                    type="tel"
                    placeholder="+92 3XX XXXXXXX"
                  />
                </Field>
                <Field label="Location / City">
                  <TextInput
                    icon={MapPin}
                    placeholder="e.g. Lahore, Pakistan"
                  />
                </Field>
                <Field
                  label="Website / Portfolio"
                  hint="Optional — shown on your agent profile."
                >
                  <TextInput
                    icon={Globe}
                    type="url"
                    placeholder="https://yoursite.com"
                  />
                </Field>
              </div>
            </Card>
          </>
        )}

        {/* ════ SECURITY TAB ═══════════════════════════════════════════ */}
        {activeTab === "security" && (
          <>
            {/* Change Password */}
            <Card
              title="Change Password"
              description="Use a strong password that you don't use anywhere else."
              footer={
                <button className="flex items-center gap-1.5 bg-royal-600 hover:bg-royal-700 text-white text-[14px] font-bold px-5 py-2.5 rounded-sm transition-colors cursor-pointer">
                  Update Password
                </button>
              }
            >
              <div className="space-y-4 max-w-md">
                <Field label="Current Password">
                  <PasswordInput placeholder="Enter current password" />
                </Field>
                <Field label="New Password">
                  <PasswordInput placeholder="Create a strong password" />
                </Field>
                <Field label="Confirm New Password">
                  <PasswordInput placeholder="Repeat new password" />
                </Field>
              </div>
            </Card>

            {/* Active Sessions */}
            <Card
              title="Active Sessions"
              description="Devices currently logged into your account."
            >
              {[
                {
                  device: "Chrome on Windows",
                  loc: "Lahore, Pakistan",
                  current: true,
                  icon: Globe,
                },
                {
                  device: "Mobile App (Android)",
                  loc: "Islamabad, Pakistan",
                  current: false,
                  icon: Smartphone,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                      <s.icon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-900 dark:text-white">
                        {s.device}
                      </p>
                      <p className="text-[13px] font-medium text-slate-500 mt-0.5">
                        {s.loc}{" "}
                        {s.current && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            · Current session
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {!s.current && (
                    <button className="text-[13px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer">
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </Card>

            {/* Connected Accounts */}
            <Card
              title="Connected Accounts"
              description="Third-party accounts linked to your profile."
            >
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[15px] font-bold text-slate-600 shrink-0">
                    G
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-slate-900 dark:text-white">
                      Google Account
                    </p>
                    <p className="text-[13px] font-medium text-slate-500 mt-1">
                      {user?.authProvider === "google" ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Connected
                        </span>
                      ) : (
                        "Not connected"
                      )}
                    </p>
                  </div>
                </div>
                <button className="text-[14px] font-bold text-royal-600 dark:text-royal-400 border border-royal-200 dark:border-royal-500/30 px-4 py-2 rounded-sm hover:bg-royal-50 dark:hover:bg-royal-500/10 transition-colors cursor-pointer">
                  {user?.authProvider === "google" ? "Disconnect" : "Connect"}
                </button>
              </div>
            </Card>
          </>
        )}

        {/* ════ NOTIFICATIONS TAB ══════════════════════════════════════ */}
        {activeTab === "notifications" && (
          <>
            {/* Email Notifications */}
            <Card
              title="Email Notifications"
              description="Choose what you receive in your inbox."
            >
              <ToggleRow
                title="New Property Alerts"
                desc="Get notified when properties match your saved searches."
                defaultChecked={true}
              />
              <ToggleRow
                title="Inquiry Replies"
                desc="Email when someone replies to your property inquiry."
                defaultChecked={true}
              />
              <ToggleRow
                title="Order Updates"
                desc="Receive email updates about your Props Shop orders."
                defaultChecked={true}
              />
              <ToggleRow
                title="Marketing & Promos"
                desc="Hear about new features and discounts on Royal Property Finder."
                defaultChecked={false}
              />
              <ToggleRow
                title="Weekly Newsletter"
                desc="A weekly digest of top real estate news and trends."
                defaultChecked={false}
              />
            </Card>

            {/* In-App Notifications */}
            <Card
              title="In-App Notifications"
              description="Control what appears in your notification bell."
            >
              <ToggleRow
                title="New Messages"
                desc="Show a badge when you receive new inbox messages."
                defaultChecked={true}
              />
              <ToggleRow
                title="Listing Views"
                desc="Notify you when your listings get significant views."
                defaultChecked={true}
              />
              <ToggleRow
                title="Price Drop Alerts"
                desc="Alert when saved properties drop in price."
                defaultChecked={true}
              />
              <ToggleRow
                title="Listing Status Changes"
                desc="Notify you when a listing is approved, rejected, or expired."
                defaultChecked={false}
              />
            </Card>
          </>
        )}

        {/* ════ PRIVACY TAB ════════════════════════════════════════════ */}
        {activeTab === "privacy" && (
          <>
            {/* Visibility */}
            <Card
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
            </Card>

            {/* Data & Account */}
            <Card
              title="Data & Account"
              description="Manage your data and account lifecycle."
            >
              <DangerRow
                icon={LogOut}
                label="Sign Out All Devices"
                desc="Immediately revoke all active sessions across your devices."
              />
              <DangerRow
                icon={AlertTriangle}
                label="Deactivate Account"
                desc="Temporarily hide your profile and listings from the platform."
              />
              <DangerRow
                icon={Trash2}
                label="Delete Account"
                desc="Permanently delete your account and all associated data. This cannot be undone."
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

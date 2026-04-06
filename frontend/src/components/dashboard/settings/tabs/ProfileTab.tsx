"use client";

import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { User, Mail, Phone, MapPin, Camera, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { setAuth } from "@/store/slices/authSlice";
import { AuthService } from "@/services/auth.service";
import { SettingsCard } from "../components/SettingsCard";
import { Field, TextInput } from "../components/Inputs";

export function ProfileTab({ user }: { user: any }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.city || "");

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("city", city);

    setIsProfileUpdating(true);
    try {
      const response = await AuthService.updateProfile(formData);
      if (response.success) {
        toast.success("Profile updated successfully!");
        dispatch(setAuth(response.data));
      }
    } catch (err: any) {
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size is too large (max 2MB)");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    setIsPhotoUploading(true);
    try {
      const response = await AuthService.updateProfile(formData);
      if (response.success) {
        toast.success("Profile photo updated!");
        dispatch(setAuth(response.data));
      }
    } catch (err: any) {
    } finally {
      setIsPhotoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Avatar Card */}
      <SettingsCard
        title="Profile Photo"
        description="This is shown publicly on your listings and messages."
        footer={
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isPhotoUploading}
              className="flex items-center gap-2 bg-royal-600 hover:bg-royal-700 text-white text-[14px] font-bold px-5 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-75 shadow-sm"
            >
              {isPhotoUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-white" />
                  Upload Photo
                </>
              )}
            </button>
          </>
        }
      >
        <div className="flex items-center gap-5">
          <div 
            className="relative shrink-0 cursor-pointer group/avatar"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-sm bg-royal-100 dark:bg-royal-900/30 border border-royal-200 dark:border-royal-800/40 flex items-center justify-center text-royal-700 dark:text-royal-400 font-bold text-2xl uppercase overflow-hidden group-hover/avatar:opacity-80 transition-opacity">
              {isPhotoUploading ? (
                <div className="flex items-center justify-center w-full h-full bg-slate-50 dark:bg-slate-800/50">
                  <Loader2 className="w-6 h-6 text-royal-500 animate-spin" />
                </div>
              ) : user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.[0] || "U"
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-royal-600 border-2 border-white dark:border-slate-900 flex items-center justify-center group-hover/avatar:scale-110 transition-transform">
              <Camera className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <p className="text-[16px] font-bold text-slate-900 dark:text-white capitalize leading-tight">
              {user?.name || "Your Name"}
            </p>
            <p className="text-[13px] font-medium text-slate-500 mt-1">
              {user?.email}
            </p>
            <p className="text-[12px] text-slate-500 mt-2 italic font-medium">
              JPG, PNG or GIF · Max 2 MB
            </p>
          </div>
        </div>
      </SettingsCard>

      {/* Personal Info Card */}
      <form onSubmit={handleProfileUpdate}>
        <SettingsCard
          title="Personal Information"
          description="Your name and contact details visible to other users."
          footer={
            <button 
              type="submit"
              disabled={isProfileUpdating}
              className="flex items-center gap-1.5 bg-royal-600 hover:bg-royal-700 text-white text-[14px] font-bold px-5 py-2.5 rounded-sm transition-colors cursor-pointer disabled:opacity-75 shadow-sm"
            >
              {isProfileUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name">
              <TextInput
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </Field>
            <Field label="Email Address">
              <div className="space-y-2">
                <TextInput
                  icon={Mail}
                  type="email"
                  value={user?.email}
                  disabled
                  placeholder="your@email.com"
                />
                {(user?.isEmailVerified || user?.role === "admin") && (
                  <p className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Verified email
                  </p>
                )}
              </div>
            </Field>
            <Field label="Phone Number" hint="Ideal for direct client contact.">
              <TextInput
                icon={Phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 3XX XXXXXXX"
              />
            </Field>
            <Field label="Location / City">
              <TextInput
                icon={MapPin}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore, Pakistan"
              />
            </Field>
          </div>
        </SettingsCard>
      </form>
    </div>
  );
}

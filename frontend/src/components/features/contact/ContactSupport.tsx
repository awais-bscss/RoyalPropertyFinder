"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Building2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InquiryService } from "@/services/inquiry.service";

export function ContactSupport() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    subject: "",
    type: "support",
    message: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        senderName: user.name || "",
        senderEmail: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.senderName || !formData.senderEmail || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await InquiryService.submitInquiry(formData);
      setSuccess(true);
      toast.success("Your message has been sent successfully!");
      setFormData({
        senderName: "",
        senderEmail: "",
        senderPhone: "",
        subject: "",
        type: "support",
        message: "",
      });
      // Reset success state after some time
      setTimeout(() => setSuccess(false), 8000);
    } catch (error: any) {
      console.error("Inquiry submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again later.",
      );
    } finally {
      setLoading(true); // Wait a bit before allowing another submit (spinner UX)
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-[15px]">
            Have a question, need technical support, or want to explore an
            advertising opportunity? Drop us a message and our team will get
            back to you promptly.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: Contact Information */}
          <div className="w-full lg:w-[35%] flex flex-col gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-royal-100 dark:bg-royal-900/40 text-royal-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Email Us
                    </p>
                    <a
                      href="mailto:support@royalproperty.com"
                      className="text-[15px] font-semibold text-slate-900 dark:text-white hover:text-royal-600 transition-colors"
                    >
                      support@royalproperty.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Call Us
                    </p>
                    <a
                      href="tel:+923001234567"
                      className="text-[15px] font-semibold text-slate-900 dark:text-white hover:text-emerald-600 transition-colors"
                    >
                      +92 300 1234567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Head Office
                    </p>
                    <p className="text-[15px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      123 DHA Phase 6, Main Boulevard
                      <br />
                      Lahore, Pakistan
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative block */}
              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 text-slate-500">
                  <Building2 className="w-8 h-8 opacity-40" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-[15px]">
                      Royal Property Finder
                    </p>
                    <p className="text-[12px] font-medium">
                      Pakistan's Premier Real Estate Portal
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full lg:w-[65%]">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              {success ? (
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-[15px] font-medium max-w-sm">
                    Thank you for reaching out. We have received your inquiry
                    and will contact you at{" "}
                    <strong>{formData.senderEmail}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-royal-600 font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : null}

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-royal-600" />
                Send us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[14px] focus:outline-none focus:border-royal-600 focus:ring-1 focus:ring-royal-600 transition-all dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="senderEmail"
                      value={formData.senderEmail}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[14px] focus:outline-none focus:border-royal-600 focus:ring-1 focus:ring-royal-600 transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="senderPhone"
                      value={formData.senderPhone}
                      onChange={handleChange}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[14px] focus:outline-none focus:border-royal-600 focus:ring-1 focus:ring-royal-600 transition-all dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Inquiry Type
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="w-full h-[46px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[14px] focus:ring-1 focus:ring-royal-600 transition-all dark:text-white px-4">
                        <SelectValue placeholder="Select Inquiry Type" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      >
                        <SelectItem value="support">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="billing">
                          Billing & Packages
                        </SelectItem>
                        <SelectItem value="report">
                          Report a Listing/User
                        </SelectItem>
                        <SelectItem value="advertising">
                          Advertising with Us
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Briefly describe your inquiry"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[14px] focus:outline-none focus:border-royal-600 focus:ring-1 focus:ring-royal-600 transition-all dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide as much detail as possible..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[14px] focus:outline-none focus:border-royal-600 focus:ring-1 focus:ring-royal-600 transition-all resize-none dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-royal-600 hover:bg-royal-700 active:bg-royal-800 text-white font-bold rounded-xl text-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

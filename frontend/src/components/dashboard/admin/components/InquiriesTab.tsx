"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Search,
} from "lucide-react";
import { INQUIRY_STATUS, INQUIRY_TYPES, timeAgo } from "../types";
import type { SupportInquiry } from "../types";

// Mock data until backend is ready
const MOCK_INQUIRIES: SupportInquiry[] = [
  {
    id: "inq-1",
    subject: "I want to advertise my agency on the homepage",
    message:
      "Hello team, I represent Al-Kabir Developers. We would like to purchase a banner spot on your main landing page for 3 months. Please let me know the pricing and process.",
    senderName: "Ahmad Raza",
    senderEmail: "ahmad.raza@alkabir.com",
    senderPhone: "0300-1234567",
    type: "advertising",
    status: "open",
    priority: "high",
    createdAt: new Date().toISOString(),
  },
  {
    id: "inq-2",
    subject: "Fake property listing reported",
    message:
      "The listing titled '5 Marla Plot in DHA Phase 6' seems fake. The images are stolen from another website and the price is unbelievably low. Please investigate this user.",
    senderName: "Usman Ali",
    senderEmail: "usman99@gmail.com",
    type: "report",
    status: "in_progress",
    priority: "high",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "inq-3",
    subject: "Issue uploading property images",
    message:
      "Hi, whenever I try to upload more than 5 images to my new listing, the page freezes and I have to restart. I am using Chrome on an iPad.",
    senderName: "Sarah Khan",
    senderEmail: "sarah.k@yahoo.com",
    type: "support",
    status: "open",
    priority: "medium",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "inq-4",
    subject: "Refund request for premium package",
    message:
      "I bought the premium agent package yesterday but I realized I selected the wrong city. Can you please cancel this subscription so I can buy the correct one?",
    senderName: "Irfan Estate",
    senderEmail: "billing@irfanestate.com",
    type: "billing",
    status: "resolved",
    priority: "low",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
];

export function InquiriesTab() {
  const [inquiries, setInquiries] = useState<SupportInquiry[]>(MOCK_INQUIRIES);
  const [activeId, setActiveId] = useState<string | null>(MOCK_INQUIRIES[0].id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const activeInquiry = inquiries.find((i) => i.id === activeId);

  const filtered = inquiries.filter((inq) => {
    const matchSearch =
      inq.subject.toLowerCase().includes(search.toLowerCase()) ||
      inq.senderName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || inq.status === filter;
    return matchSearch && matchFilter;
  });

  const handleStatusChange = (status: "open" | "in_progress" | "resolved") => {
    if (!activeId) return;
    setInquiries((prev) =>
      prev.map((i) => (i.id === activeId ? { ...i, status } : i)),
    );
    toast.success(`Ticket marked as ${INQUIRY_STATUS[status].label}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      {/* ── Left Sidebar (Inbox List) ── */}
      <div className="w-full md:w-[320px] lg:w-[380px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-royal-400"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {["all", "open", "in_progress", "resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[12px] font-bold capitalize transition-colors cursor-pointer ${
                  filter === f
                    ? "bg-royal-100 text-royal-700 dark:bg-royal-500/20 dark:text-royal-400"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400 text-center">
              <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-[13px] font-semibold">No inquiries found</p>
              <p className="text-[11px]">Inbox is clear!</p>
            </div>
          ) : (
            filtered.map((inq) => {
              const typeCfg = INQUIRY_TYPES[inq.type];
              const statCfg = INQUIRY_STATUS[inq.status];
              const isActive = activeId === inq.id;

              return (
                <button
                  key={inq.id}
                  onClick={() => setActiveId(inq.id)}
                  className={`w-full text-left p-4 transition-colors cursor-pointer ${
                    isActive
                      ? "bg-royal-50/50 dark:bg-slate-800/50"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                      {inq.senderName}
                    </span>
                    <span className="text-[10px] whitespace-nowrap text-slate-400 font-medium">
                      {timeAgo(inq.createdAt)}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-600 dark:text-slate-300 font-semibold truncate mb-2">
                    {inq.subject}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${typeCfg.color}`}
                    >
                      {typeCfg.label}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${statCfg.cls}`}
                    >
                      {statCfg.label}
                    </span>
                    {inq.priority === "high" && (
                      <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-auto" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Pane (Active Inquiry Detail) ── */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm min-h-[500px]">
        {activeInquiry ? (
          <>
            {/* Thread Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-[18px] font-black text-slate-900 dark:text-white mb-2">
                    {activeInquiry.subject}
                  </h2>
                  <div className="flex items-center gap-4 text-[13px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      {activeInquiry.senderEmail}
                    </div>
                    {activeInquiry.senderPhone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        {activeInquiry.senderPhone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="shrink-0 flex items-center gap-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">
                    Status
                  </p>
                  <select
                    value={activeInquiry.status}
                    onChange={(e) => handleStatusChange(e.target.value as any)}
                    className="pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer appearance-none outline-none"
                  >
                    <option value="open">Needs Reply</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved / Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/20">
              {/* Original Message bubble */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 w-fit max-w-[90%] shadow-sm">
                <div className="flex justify-between items-center gap-8 mb-2 border-b border-slate-100 dark:border-slate-700/50 pb-2">
                  <span className="font-bold text-[14px] text-slate-900 dark:text-white">
                    {activeInquiry.senderName}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {new Date(activeInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {activeInquiry.message}
                </p>
              </div>

              {/* Fake System Notice if resolved */}
              {activeInquiry.status === "resolved" && (
                <div className="flex items-center gap-2 justify-center mt-6 text-emerald-600 font-bold text-[12px] bg-emerald-50 dark:bg-emerald-500/10 py-2 rounded-lg max-w-[80%] mx-auto shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Ticket closed by Admin
                </div>
              )}
            </div>

            {/* Reply Box */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="relative">
                <textarea
                  placeholder={
                    activeInquiry.status === "resolved"
                      ? "Ticket is closed. Re-open to reply."
                      : "Type your reply directly to the user's email..."
                  }
                  disabled={activeInquiry.status === "resolved"}
                  className="w-full h-24 p-3 pr-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[14px] resize-none focus:outline-none focus:border-royal-400 disabled:opacity-50 disabled:bg-slate-100"
                />
                <button
                  disabled={activeInquiry.status === "resolved"}
                  onClick={() => toast.success("Reply sent to user's email!")}
                  className="absolute bottom-3 right-3 px-4 py-2 bg-royal-600 hover:bg-royal-700 disabled:opacity-50 text-white font-bold text-[13px] rounded-lg transition-colors cursor-pointer shadow-md shadow-royal-500/20"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Mail className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-semibold text-slate-500">
              Select an inquiry to read
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

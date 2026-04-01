"use client";

import { useState } from "react";
import {
  Search,
  Star,
  Trash2,
  MoreVertical,
  Paperclip,
  Send,
  ChevronDown,
  Building2,
  User,
  Inbox as InboxIcon,
  Circle,
} from "lucide-react";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const conversations = [
  {
    id: 1,
    name: "Ahmed Raza",
    avatar: "AR",
    avatarBg: "bg-royal-600",
    subject: "Inquiry: DHA Phase 6 Apartment",
    preview:
      "Hi, I'm interested in your DHA Phase 6 listing. Can we schedule a visit?",
    time: "2:41 PM",
    unread: true,
    starred: true,
    property: "DHA Phase 6 Apartment",
    messages: [
      {
        id: 1,
        from: "Ahmed Raza",
        avatar: "AR",
        avatarBg: "bg-royal-600",
        isSelf: false,
        text: "Hi! I saw your listing for the DHA Phase 6 Apartment. The price looks great. Can we schedule a visit this weekend?",
        time: "2:30 PM",
      },
      {
        id: 2,
        from: "You",
        avatar: "ME",
        avatarBg: "bg-slate-600",
        isSelf: true,
        text: "Hello Ahmed! Absolutely, I'd be happy to schedule a visit. Saturday afternoon works for me. What time suits you?",
        time: "2:35 PM",
      },
      {
        id: 3,
        from: "Ahmed Raza",
        avatar: "AR",
        avatarBg: "bg-royal-600",
        isSelf: false,
        text: "Hi, I'm interested in your DHA Phase 6 listing. Can we schedule a visit?",
        time: "2:41 PM",
      },
    ],
  },
  {
    id: 2,
    name: "Sara Khan",
    avatar: "SK",
    avatarBg: "bg-emerald-600",
    subject: "Re: Studio Apartment F-7",
    preview: "Thank you for the details. I will discuss with my family.",
    time: "11:20 AM",
    unread: true,
    starred: false,
    property: "Studio Apartment F-7",
    messages: [
      {
        id: 1,
        from: "Sara Khan",
        avatar: "SK",
        avatarBg: "bg-emerald-600",
        isSelf: false,
        text: "Hi, I saw the Studio Apartment in F-7. Is the rent negotiable? Also, is parking included?",
        time: "10:50 AM",
      },
      {
        id: 2,
        from: "You",
        avatar: "ME",
        avatarBg: "bg-slate-600",
        isSelf: true,
        text: "Hello Sara! The rent is PKR 65K/month and includes one covered parking spot. There's some flexibility if you're looking for a longer lease.",
        time: "11:05 AM",
      },
      {
        id: 3,
        from: "Sara Khan",
        avatar: "SK",
        avatarBg: "bg-emerald-600",
        isSelf: false,
        text: "Thank you for the details. I will discuss with my family.",
        time: "11:20 AM",
      },
    ],
  },
  {
    id: 3,
    name: "Bilal Hussain",
    avatar: "BH",
    avatarBg: "bg-violet-600",
    subject: "Bahria Town Commercial Plot",
    preview: "What's the current market value of this plot?",
    time: "Yesterday",
    unread: false,
    starred: true,
    property: "Bahria Town Commercial",
    messages: [
      {
        id: 1,
        from: "Bilal Hussain",
        avatar: "BH",
        avatarBg: "bg-violet-600",
        isSelf: false,
        text: "Good day! What's the current market value of this Bahria Town commercial plot and is there room for negotiation?",
        time: "Yesterday, 3:15 PM",
      },
    ],
  },
  {
    id: 4,
    name: "Usman Ali",
    avatar: "UA",
    avatarBg: "bg-amber-600",
    subject: "Property Visit Confirmation",
    preview: "Confirmed! See you at 3 PM on Saturday.",
    time: "Mon",
    unread: false,
    starred: false,
    property: "Gulberg Residencia",
    messages: [
      {
        id: 1,
        from: "You",
        avatar: "ME",
        avatarBg: "bg-slate-600",
        isSelf: true,
        text: "Hi Usman, just confirming your visit for Saturday at 3 PM. Please bring a valid CNIC for building entry.",
        time: "Mon, 10:00 AM",
      },
      {
        id: 2,
        from: "Usman Ali",
        avatar: "UA",
        avatarBg: "bg-amber-600",
        isSelf: false,
        text: "Confirmed! See you at 3 PM on Saturday.",
        time: "Mon, 10:45 AM",
      },
    ],
  },
  {
    id: 5,
    name: "Nadia Malik",
    avatar: "NM",
    avatarBg: "bg-rose-500",
    subject: "Re: Rent Agreement Query",
    preview: "Can you share the standard rent agreement format?",
    time: "Sun",
    unread: false,
    starred: false,
    property: "DHA Phase 6 Apartment",
    messages: [
      {
        id: 1,
        from: "Nadia Malik",
        avatar: "NM",
        avatarBg: "bg-rose-500",
        isSelf: false,
        text: "Can you share the standard rent agreement format you use? I'd like my lawyer to review it before we finalize.",
        time: "Sun, 6:30 PM",
      },
    ],
  },
];

// ── Inbox Component ────────────────────────────────────────────────────────────
export function Inbox() {
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

  const filtered = conversations.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    if (filter === "unread") return matchSearch && c.unread;
    if (filter === "starred") return matchSearch && c.starred;
    return matchSearch;
  });

  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <div className="flex h-[calc(100vh-130px)] bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* ── Left panel: conversation list ─────────────────────────── */}
      <div className="w-[300px] shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <InboxIcon className="w-5 h-5 text-royal-600" />
              Inbox
              <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-royal-600 text-white rounded-full">
                {conversations.filter((c) => c.unread).length}
              </span>
            </h2>
            <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-9 pr-3 py-2.5 text-[14px] font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-royal-400 transition-colors"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {(["all", "unread", "starred"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-[13px] font-bold capitalize transition-colors cursor-pointer ${
                filter === f
                  ? "text-royal-600 border-b-2 border-royal-600"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
              <InboxIcon className="w-8 h-8 mb-2 opacity-30" />
              No conversations
            </div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left px-4 py-3.5 border-b border-slate-50 dark:border-slate-800 transition-colors cursor-pointer ${
                  selectedId === c.id
                    ? "bg-royal-50 dark:bg-royal-500/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full ${c.avatarBg} flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5`}
                  >
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span
                        className={`text-[14px] truncate ${c.unread ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-700 dark:text-slate-300"}`}
                      >
                        {c.name}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap shrink-0">
                        {c.time}
                      </span>
                    </div>
                    <p
                      className={`text-[13px] font-medium truncate ${c.unread ? "text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-400"}`}
                    >
                      {c.subject}
                    </p>
                    <p className="text-[12px] text-slate-500 truncate mt-1">
                      {c.preview}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 ml-10">
                  {c.unread && (
                    <Circle className="w-2 h-2 fill-royal-600 text-royal-600" />
                  )}
                  {c.starred && (
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  )}
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[140px]">{c.property}</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right panel: message thread ────────────────────────────── */}
      {selected ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Thread header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${selected.avatarBg} flex items-center justify-center text-white text-[13px] font-bold shrink-0`}
              >
                {selected.avatar}
              </div>
              <div>
                <p className="text-[16px] font-bold text-slate-900 dark:text-white">
                  {selected.name}
                </p>
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{selected.property}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-2 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer">
                <Star
                  className={`w-4 h-4 ${selected.starred ? "fill-amber-400 text-amber-400" : ""}`}
                />
              </button>
              <button className="p-2 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subject bar */}
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
            <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200">
              {selected.subject}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {selected.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.isSelf ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-9 h-9 rounded-full ${msg.avatarBg} flex items-center justify-center text-white text-[12px] font-bold shrink-0 mt-0.5`}
                >
                  {msg.isSelf ? <User className="w-4 h-4" /> : msg.avatar}
                </div>
                <div
                  className={`max-w-[70%] ${msg.isSelf ? "items-end" : "items-start"} flex flex-col gap-1`}
                >
                  <div
                    className={`px-4 py-3 rounded-sm text-[14px] leading-relaxed ${
                      msg.isSelf
                        ? "bg-royal-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[12px] font-medium text-slate-500">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Reply box */}
          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex items-end gap-3 border border-slate-200 dark:border-slate-700 rounded-sm p-3 bg-white dark:bg-slate-900 focus-within:border-royal-400 transition-colors">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="flex-1 resize-none text-[14px] font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-500 bg-transparent focus:outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setReply("")}
                  disabled={!reply.trim()}
                  className="flex items-center gap-1.5 bg-royal-600 hover:bg-royal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-bold px-4 py-2 rounded-sm transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
          <div className="w-16 h-16 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <InboxIcon className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <p className="text-[16px] font-bold text-slate-800 dark:text-slate-200">
              Select a conversation
            </p>
            <p className="text-[14px] text-slate-500 mt-1">
              Choose a message from the list to start reading
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

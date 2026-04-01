import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Clock,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Loader2,
  Trash2,
  Star,
  Paperclip,
  Send,
  MoreVertical,
  Building2,
  Inbox as InboxIcon,
  Circle,
  User,
  ChevronDown,
} from "lucide-react";
import { INQUIRY_STATUS, INQUIRY_TYPES, timeAgo } from "../types";
import type { SupportInquiry } from "../types";
import { InquiryService } from "@/services/inquiry.service";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteInquiryModal } from "./DeleteInquiryModal";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarBg = (name: string) => {
  const colors = [
    "bg-royal-600",
    "bg-emerald-600",
    "bg-violet-600",
    "bg-amber-600",
    "bg-rose-500",
    "bg-blue-600",
    "bg-indigo-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export function InquiriesTab() {
  const [inquiries, setInquiries] = useState<SupportInquiry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "open" | "in_progress" | "resolved"
  >("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await InquiryService.getAllInquiries();
      if (data.success) {
        setInquiries(data.data);
        if (data.data.length > 0 && !activeId) {
          setActiveId(data.data[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
      toast.error("Cloud not load inquiries. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [activeId]);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const activeInquiry = useMemo(
    () => inquiries.find((i) => i._id === activeId),
    [inquiries, activeId],
  );

  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        inq.subject.toLowerCase().includes(search.toLowerCase()) ||
        inq.senderName.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || inq.status === filter;
      return matchSearch && matchFilter;
    });
  }, [inquiries, search, filter]);

  const handleStatusChange = async (
    status: "open" | "in_progress" | "resolved",
  ) => {
    if (!activeId) return;
    try {
      setUpdating(true);
      const res = await InquiryService.updateInquiryStatus(activeId, status);
      if (res.success) {
        setInquiries((prev) =>
          prev.map((i) => (i._id === activeId ? { ...i, status } : i)),
        );
        toast.success(`Ticket marked as ${INQUIRY_STATUS[status].label}`);
      }
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (priority: "low" | "medium" | "high") => {
    if (!activeId) return;
    try {
      setUpdating(true);
      const res = await InquiryService.updateInquiryPriority(
        activeId,
        priority,
      );
      if (res.success) {
        setInquiries((prev) =>
          prev.map((i) => (i._id === activeId ? { ...i, priority } : i)),
        );
        toast.success(`Priority updated to ${priority.toUpperCase()}`);
      }
    } catch (err) {
      toast.error("Failed to update priority.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReply = async () => {
    if (!activeId || !reply.trim()) return;
    try {
      setSendingReply(true);
      const res = await InquiryService.replyToInquiry(activeId, reply);
      if (res.success) {
        toast.success("Reply sent to user's email");
        setReply("");
        fetchInquiries();
      }
    } catch (err) {
      toast.error("Failed to send reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDeletePrompt = () => {
    if (!activeId) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!activeId) return;
    try {
      setDeleting(true);
      const res = await InquiryService.deleteInquiry(activeId);
      if (res.success) {
        toast.success("Inquiry deleted successfully");
        setInquiries((prev) => prev.filter((i) => i._id !== activeId));
        setActiveId(null);
        setShowDeleteModal(false);
      }
    } catch (err) {
      toast.error("Failed to delete inquiry.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-130px)] bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      {/* ── Left panel: inquiry list ─────────────────────────── */}
      <div className="w-[320px] md:w-[380px] shrink-0 flex flex-col border-r border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <InboxIcon className="w-5 h-5 text-royal-600" />
              Inquiries
              <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-royal-600 text-white rounded-full">
                {inquiries.filter((inq) => inq.status !== "resolved").length}
              </span>
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold text-[12px]"
              >
                <DropdownMenuLabel className="text-[11px] uppercase tracking-widest text-slate-400">
                  Sidebar Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                <DropdownMenuItem
                  onClick={() => fetchInquiries()}
                  className="cursor-pointer focus:bg-royal-50 dark:focus:bg-royal-500/10 focus:text-royal-600 py-2"
                >
                  <Loader2 className="mr-2 h-4 w-4" />
                  Refresh List
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer focus:bg-royal-50 dark:focus:bg-royal-500/10 focus:text-royal-600 py-2"
                  onClick={() => setSearch("")}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Clear Search
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inquiries..."
              className="w-full pl-9 pr-3 py-2.5 text-[14px] font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-royal-400 transition-colors"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {(["all", "open", "in_progress", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 text-[11px] font-bold capitalize transition-colors cursor-pointer border-r last:border-r-0 border-slate-100 dark:border-slate-800 ${
                filter === f
                  ? "text-royal-600 border-b-2 border-b-royal-600"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {f === "in_progress" ? "Working" : f}
            </button>
          ))}
        </div>

        {/* Inquiry list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="p-4 border-b border-slate-50 dark:border-slate-800 space-y-3"
                >
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-3 w-40" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
              <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
              No inquiries found
            </div>
          ) : (
            filtered.map((inq) => (
              <button
                key={inq._id}
                onClick={() => setActiveId(inq._id)}
                className={`w-full text-left px-4 py-3.5 border-b border-slate-50 dark:border-slate-800 transition-colors cursor-pointer ${
                  activeId === inq._id
                    ? "bg-royal-50 dark:bg-royal-500/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full ${getAvatarBg(inq.senderName)} flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5`}
                  >
                    {getInitials(inq.senderName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span
                        className={`text-[14px] truncate ${inq.status === "open" ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-700 dark:text-slate-300"}`}
                      >
                        {inq.senderName}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap shrink-0">
                        {timeAgo(inq.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`text-[13px] font-medium truncate ${inq.status === "open" ? "text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-400"}`}
                    >
                      {inq.subject}
                    </p>
                    <p className="text-[12px] text-slate-500 truncate mt-1">
                      {inq.message}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1.5 ml-10">
                  <div className="flex items-center gap-1.5">
                    {inq.status === "open" && (
                      <Circle className="w-2 h-2 fill-royal-600 text-royal-600" />
                    )}
                    {inq.priority === "high" && (
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    )}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${INQUIRY_TYPES[inq.type].color}`}
                    >
                      {INQUIRY_TYPES[inq.type].label}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border ${INQUIRY_STATUS[inq.status].cls}`}
                  >
                    {INQUIRY_STATUS[inq.status].label}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right panel: message thread ────────────────────────────── */}
      {activeInquiry ? (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/20 dark:bg-slate-900/40">
          {/* Thread header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${getAvatarBg(activeInquiry.senderName)} flex items-center justify-center text-white text-[13px] font-bold shrink-0`}
              >
                {getInitials(activeInquiry.senderName)}
              </div>
              <div>
                <p className="text-[16px] font-bold text-slate-900 dark:text-white">
                  {activeInquiry.senderName}
                </p>
                <div className="flex items-center gap-3 text-[12px] font-medium text-slate-500 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{activeInquiry.senderEmail}</span>
                  </div>
                  {activeInquiry.senderPhone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{activeInquiry.senderPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Select
                  value={activeInquiry.status}
                  onValueChange={(val) => handleStatusChange(val as any)}
                  disabled={updating}
                >
                  <SelectTrigger className="h-8 w-[140px] text-[11px] font-bold border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    sideOffset={8}
                    className="text-[12px] font-bold"
                  >
                    <SelectItem value="open">Needs Reply</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={activeInquiry.priority}
                  onValueChange={(val) => handlePriorityChange(val as any)}
                  disabled={updating}
                >
                  <SelectTrigger className="h-8 w-[100px] text-[11px] font-bold border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    sideOffset={8}
                    className="text-[12px] font-bold"
                  >
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium" className="text-amber-600">
                      Medium
                    </SelectItem>
                    <SelectItem value="high" className="text-rose-600">
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="bottom"
                  sideOffset={8}
                  className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold text-[12px]"
                >
                  <DropdownMenuLabel className="text-[11px] uppercase tracking-widest text-slate-400">
                    Inquiry Actions
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-royal-50 dark:focus:bg-royal-500/10 focus:text-royal-600 py-2.5"
                    onClick={() =>
                      copyToClipboard(activeInquiry.senderEmail, "Email")
                    }
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Copy Email Address
                  </DropdownMenuItem>

                  {activeInquiry.senderPhone && (
                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-royal-50 dark:focus:bg-royal-500/10 focus:text-royal-600 py-2.5"
                      onClick={() =>
                        copyToClipboard(activeInquiry.senderPhone!, "Phone")
                      }
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Copy Phone Number
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer py-2.5 text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-500/10 focus:text-rose-600"
                    onClick={handleDeletePrompt}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Inquiry
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Subject bar */}
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/30">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200">
                {activeInquiry.subject}
              </p>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${INQUIRY_STATUS[activeInquiry.status].cls}`}
              >
                {INQUIRY_STATUS[activeInquiry.status].label}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            {/* Initial Inquiry Message */}
            <div className="flex gap-3">
              <div
                className={`w-9 h-9 rounded-full ${getAvatarBg(activeInquiry.senderName)} flex items-center justify-center text-white text-[12px] font-bold shrink-0 mt-0.5`}
              >
                {getInitials(activeInquiry.senderName)}
              </div>
              <div className="max-w-[75%] items-start flex flex-col gap-1.5">
                <div className="px-4 py-3 rounded-sm text-[14px] leading-relaxed bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm">
                  {activeInquiry.message}
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  {new Date(activeInquiry.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Admin Replies */}
            {activeInquiry.replies?.map((rep, idx) => (
              <div key={idx} className="flex gap-3 flex-row-reverse">
                <div className="w-9 h-9 rounded-full bg-royal-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5 shadow-md shadow-royal-500/20">
                  <User className="w-4 h-4" />
                </div>
                <div className="max-w-[75%] items-end flex flex-col gap-1.5">
                  <div className="px-4 py-3 rounded-sm text-[14px] leading-relaxed bg-royal-600 text-white shadow-md shadow-royal-500/10">
                    <p className="font-bold text-[11px] mb-1 opacity-80 border-b border-white/20 pb-0.5">
                      {rep.adminName} (Admin)
                    </p>
                    {rep.message}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">
                    {new Date(rep.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            {activeInquiry.status === "resolved" && (
              <div className="flex items-center gap-2 justify-center text-emerald-600 font-bold text-[12px] bg-emerald-50 dark:bg-emerald-500/10 py-2.5 rounded-sm border border-emerald-100 dark:border-emerald-500/20 max-w-[300px] mx-auto">
                <CheckCircle2 className="w-4 h-4" />
                This inquiry has been resolved
              </div>
            )}
          </div>

          {/* Reply box */}
          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
            <div
              className={`flex items-end gap-3 border border-slate-200 dark:border-slate-700 rounded-sm p-3 bg-white dark:bg-slate-950 focus-within:border-royal-400 transition-colors ${activeInquiry.status === "resolved" ? "opacity-50 pointer-events-none" : ""}`}
            >
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={
                  activeInquiry.status === "resolved"
                    ? "Inquiry is resolved"
                    : "Write a reply to the user..."
                }
                rows={2}
                disabled={activeInquiry.status === "resolved" || sendingReply}
                className="flex-1 resize-none text-[14px] font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-500 bg-transparent focus:outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  onClick={handleReply}
                  disabled={!reply.trim() || sendingReply}
                  className="flex items-center gap-1.5 bg-royal-600 hover:bg-royal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[14px] font-bold px-4 py-2 rounded-sm transition-colors cursor-pointer shadow-lg shadow-royal-500/10"
                >
                  {sendingReply ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8 bg-slate-50/30 dark:bg-slate-900/50">
          <div className="w-16 h-16 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
            <InboxIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <div>
            <p className="text-[16px] font-bold text-slate-800 dark:text-slate-200">
              Select an inquiry
            </p>
            <p className="text-[14px] text-slate-500 mt-1 max-w-[240px]">
              Choose weight from the list to view common inquiries and support
              tickets.
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && activeInquiry && (
        <DeleteInquiryModal
          inquiry={activeInquiry}
          isDeleting={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

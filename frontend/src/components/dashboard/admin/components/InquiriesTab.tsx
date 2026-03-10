import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
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
import { DeleteInquiryModal } from "./DeleteInquiryModal";

export function InquiriesTab() {
  const [inquiries, setInquiries] = useState<SupportInquiry[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
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
        // Refresh inquiries to show status change if any
        fetchInquiries();
      }
    } catch (err) {
      toast.error("Failed to send reply.");
    } finally {
      setSendingReply(false);
    }
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
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      {/* ── Left Sidebar (Inbox List) ── */}
      <div className="w-full md:w-[320px] lg:w-[380px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search inbox..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-900 dark:text-white focus:outline-none focus:border-royal-400"
              />
            </div>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[110px] h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 focus:ring-0 focus:ring-offset-0 hover:border-royal-300 transition-all">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={4}
                className="w-[160px] rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
              >
                <SelectItem value="all" className="text-[12px] font-bold py-2">
                  All Inquiries
                </SelectItem>
                <SelectItem value="open" className="text-[12px] font-bold py-2">
                  Needs Reply
                </SelectItem>
                <SelectItem
                  value="in_progress"
                  className="text-[12px] font-bold py-2"
                >
                  In Progress
                </SelectItem>
                <SelectItem
                  value="resolved"
                  className="text-[12px] font-bold py-2"
                >
                  Resolved
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="p-4 space-y-3">
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
            <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400 text-center">
              <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-[13px] font-semibold">No inquiries found</p>
              <p className="text-[11px]">Inbox is clear!</p>
            </div>
          ) : (
            filtered.map((inq) => {
              const typeCfg = INQUIRY_TYPES[inq.type];
              const statCfg = INQUIRY_STATUS[inq.status];
              const isActive = activeId === inq._id;

              return (
                <button
                  key={inq._id}
                  onClick={() => setActiveId(inq._id)}
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
                    <div className="ml-auto flex items-center gap-1.5">
                      {inq.priority === "high" && (
                        <span
                          className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                          title="High Priority"
                        />
                      )}
                      {inq.priority === "medium" && (
                        <span
                          className="w-2 h-2 rounded-full bg-amber-400"
                          title="Medium Priority"
                        />
                      )}
                      {inq.priority === "low" && (
                        <span
                          className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"
                          title="Low Priority"
                        />
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Pane (Active Inquiry Detail) ── */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm min-h-[500px]">
        {activeInquiry ? (
          <>
            {/* Thread Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-[18px] font-black text-slate-900 dark:text-white mb-2">
                    {activeInquiry?.subject}
                  </h2>
                  <div className="flex items-center gap-4 text-[13px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      {activeInquiry?.senderEmail}
                    </div>
                    {activeInquiry?.senderPhone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        {activeInquiry.senderPhone}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Delete Button */}
                  <div className="flex flex-col items-center">
                    {activeInquiry?.status === "resolved" && (
                      <span className="text-[9px] bg-rose-50 dark:bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full font-black mb-1.5 border border-rose-100 dark:border-rose-500/20 shadow-sm uppercase tracking-tighter shadow-rose-500/5 transition-all">
                        DONE! DELETE 👋
                      </span>
                    )}
                    <button
                      onClick={handleDeletePrompt}
                      disabled={deleting}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer disabled:opacity-50 group"
                      title="Delete Inquiry"
                    >
                      {deleting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      )}
                    </button>
                  </div>

                  <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />

                  {/* Status Dropdown */}
                  <div className="shrink-0 flex items-center gap-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">
                      Status
                    </p>
                    <div className="relative">
                      <Select
                        value={activeInquiry?.status}
                        onValueChange={(val) => handleStatusChange(val as any)}
                        disabled={updating}
                      >
                        <SelectTrigger className="w-[160px] h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] font-bold text-slate-700 dark:text-slate-300 focus:ring-0 focus:ring-offset-0 cursor-pointer hover:border-royal-300 transition-all">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={4}
                          className="w-[180px] rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
                        >
                          <SelectItem
                            value="open"
                            className="font-bold text-slate-700 dark:text-slate-300 py-2.5"
                          >
                            Needs Reply
                          </SelectItem>
                          <SelectItem
                            value="in_progress"
                            className="font-bold text-slate-700 dark:text-slate-300 py-2.5"
                          >
                            In Progress
                          </SelectItem>
                          <SelectItem
                            value="resolved"
                            className="font-bold text-slate-700 dark:text-slate-300 py-2.5"
                          >
                            Resolved / Closed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {updating && (
                        <div className="absolute -right-1 -top-1">
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-royal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-royal-500"></span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />

                  {/* Priority Dropdown */}
                  <div className="shrink-0 flex items-center gap-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">
                      Priority
                    </p>
                    <div className="relative">
                      <Select
                        value={activeInquiry?.priority}
                        onValueChange={(val) =>
                          handlePriorityChange(val as any)
                        }
                        disabled={updating}
                      >
                        <SelectTrigger className="w-[100px] h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] font-bold text-slate-700 dark:text-slate-300 focus:ring-0 focus:ring-offset-0 cursor-pointer hover:border-royal-300 transition-all">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={4}
                          className="w-[140px] rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
                        >
                          <SelectItem
                            value="low"
                            className="font-bold text-slate-500 py-2.5"
                          >
                            Low
                          </SelectItem>
                          <SelectItem
                            value="medium"
                            className="font-bold text-amber-500 py-2.5"
                          >
                            Medium
                          </SelectItem>
                          <SelectItem
                            value="high"
                            className="font-bold text-rose-600 py-2.5"
                          >
                            High
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {updating && (
                        <div className="absolute -right-1 -top-1">
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-royal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-royal-500"></span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/20">
              {/* Original Message bubble */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl rounded-tl-sm p-4 w-fit max-w-[90%] shadow-sm">
                <div className="flex justify-between items-center gap-8 mb-2 border-b border-slate-100 dark:border-slate-700/50 pb-2">
                  <span className="font-bold text-[14px] text-slate-900 dark:text-white">
                    {activeInquiry?.senderName}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {activeInquiry &&
                      new Date(activeInquiry.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {activeInquiry?.message}
                </p>
              </div>

              {/* Real Admin Replies */}
              {activeInquiry.replies?.map((reply, index) => (
                <div key={index} className="flex flex-col items-end mt-6">
                  <div className="bg-royal-600 text-white rounded-xl rounded-tr-sm p-4 w-fit max-w-[90%] shadow-lg shadow-royal-500/10">
                    <div className="flex justify-between items-center gap-8 mb-2 border-b border-white/20 pb-2">
                      <span className="font-bold text-[14px]">
                        {reply.adminName} (Admin)
                      </span>
                      <span className="text-[11px] font-semibold opacity-80">
                        {new Date(reply.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                      {reply.message}
                    </p>
                  </div>
                </div>
              ))}

              {/* Fake System Notice if resolved */}
              {activeInquiry?.status === "resolved" && (
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
                    activeInquiry?.status === "resolved"
                      ? "Ticket is closed. Re-open to reply."
                      : "Type your reply directly to the user's email..."
                  }
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  disabled={
                    activeInquiry?.status === "resolved" || sendingReply
                  }
                  className="w-full h-24 p-3 pr-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[14px] resize-none focus:outline-none focus:border-royal-400 disabled:opacity-50 disabled:bg-slate-100"
                />
                <button
                  disabled={
                    activeInquiry?.status === "resolved" ||
                    sendingReply ||
                    !reply.trim()
                  }
                  onClick={handleReply}
                  className="absolute bottom-3 right-3 px-4 py-2 bg-royal-600 hover:bg-royal-700 disabled:opacity-50 text-white font-bold text-[13px] rounded-lg transition-colors cursor-pointer shadow-md shadow-royal-500/20"
                >
                  {sendingReply ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Send Reply"
                  )}
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

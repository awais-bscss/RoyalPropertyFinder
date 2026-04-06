"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Inbox as InboxIcon, 
  RefreshCw, 
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { InquiryService } from "@/services/inquiry.service";
import { ListingInquiryService } from "@/services/listingInquiry.service";
import { toast } from "react-toastify";
import { InquirySidebar } from "./inquiriesTab/InquirySidebar";
import { ThreadHeader } from "./inquiriesTab/ThreadHeader";
import { MessageThread } from "./inquiriesTab/MessageThread";
import { ReplyArea } from "./inquiriesTab/ReplyArea";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

const INQUIRY_STATUS = {
  open: { label: "Needs Reply", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  in_progress: { label: "Working", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  resolved: { label: "Resolved", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

const getAvatarBg = (name: string) => {
  const colors = [
    "bg-royal-600",
    "bg-emerald-600",
    "bg-violet-600",
    "bg-amber-600",
    "bg-rose-500",
    "bg-blue-600",
  ];
  let hash = 0;
  if (name) {
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
  if (!name) return "??";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

export function InquiriesTab() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [activeInquiryId, setActiveInquiryId] = useState<string | null>(null);
  const [mode, setMode] = useState<"support" | "property">("support");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<any>("all");
  const [updating, setUpdating] = useState(false);
  const [reply, setReply] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sendingReply, setSendingReply] = useState(false);
  
  // Modals state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [replyToDeleteId, setReplyToDeleteId] = useState<string | null>(null);
  const [showReplyDeleteModal, setShowReplyDeleteModal] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const [supportRes, propertyRes]: any = await Promise.all([
        InquiryService.getAllInquiries(),
        ListingInquiryService.getAllListingInquiries()
      ]);
      
      const support = (supportRes.data || []).map((i: any) => ({ ...i, inquiryType: 'support' }));
      const property = (propertyRes.data || []).map((i: any) => ({ ...i, inquiryType: 'property' }));
      
      setInquiries([...support, ...property]);
    } catch (err) {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const activeInquiry = useMemo(() => 
    inquiries.find(i => i._id === activeInquiryId),
    [inquiries, activeInquiryId]
  );

  const filtered = useMemo(() => {
    return inquiries.filter(inq => {
      if (inq.inquiryType !== mode) return false;
      const matchesSearch = 
        inq.senderName?.toLowerCase().includes(search.toLowerCase()) ||
        inq.senderEmail?.toLowerCase().includes(search.toLowerCase()) ||
        inq.subject?.toLowerCase().includes(search.toLowerCase()) ||
        inq.message?.toLowerCase().includes(search.toLowerCase());
      
      if (!matchesSearch) return false;
      if (filter === 'all') return true;
      return inq.status === filter;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [inquiries, mode, search, filter]);

  const inqStats = useMemo(() => ({
    support: inquiries.filter(i => i.inquiryType === 'support' && i.status === 'open').length,
    property: inquiries.filter(i => i.inquiryType === 'property' && i.status === 'unread').length
  }), [inquiries]);

  // Auto-selection logic when switching modes
  useEffect(() => {
    if (!loading && filtered.length > 0) {
      const firstId = filtered[0]._id;
      // If nothing is selected OR if the selected one doesn't exist in the current filtered list (implying mode switch)
      if (!activeInquiryId || !filtered.find(i => i._id === activeInquiryId)) {
        setActiveInquiryId(firstId);
      }
    } else if (!loading && filtered.length === 0) {
      setActiveInquiryId(null);
    }
  }, [mode, loading, filtered.length, activeInquiryId]);

  const handleSelect = (id: string, m: "support" | "property") => {
    setActiveInquiryId(id);
    setMode(m);
  };

  const handleStatusChange = async (status: string) => {
    if (!activeInquiryId) return;
    try {
      setUpdating(true);
      if (mode === 'support') {
        await InquiryService.updateInquiryStatus(activeInquiryId, status);
      } else {
        await ListingInquiryService.updateStatus(activeInquiryId, status);
      }
      setInquiries(prev => prev.map(i => i._id === activeInquiryId ? { ...i, status } : i));
      toast.success(`Inquiry marked as ${status}`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (priority: string) => {
    if (!activeInquiryId || mode !== 'support') return;
    try {
      setUpdating(true);
      await InquiryService.updateInquiryPriority(activeInquiryId, priority);
      setInquiries(prev => prev.map(i => i._id === activeInquiryId ? { ...i, priority } : i));
      toast.success(`Priority updated to ${priority}`);
    } catch (err) {
      toast.error("Failed to update priority");
    } finally {
      setUpdating(false);
    }
  };

  const handleReply = async () => {
    if (!activeInquiryId || !reply.trim()) return;
    try {
      setSendingReply(true);
      if (mode === 'support') {
        const res: any = await InquiryService.replyToInquiry(activeInquiryId, reply, attachments);
        if (res.success) {
          setInquiries(prev => prev.map(i => i._id === activeInquiryId ? { ...i, replies: [...(i.replies || []), res.data.replies.pop()], status: 'in_progress' } : i));
          toast.success("Reply sent successfully");
        }
      } else {
        await ListingInquiryService.replyToInquiry(activeInquiryId, reply, attachments);
        // Refresh to get new reply list
        fetchInquiries();
        toast.success("Reply recorded and owner notified");
      }
      setReply("");
      setAttachments([]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const confirmDeleteInquiry = async () => {
    if (!activeInquiryId) return;
    try {
      setDeleting(true);
      if (mode === 'support') {
        await InquiryService.deleteInquiry(activeInquiryId);
      } else {
        await ListingInquiryService.deleteInquiry(activeInquiryId);
      }
      setInquiries(prev => prev.filter(i => i._id !== activeInquiryId));
      setActiveInquiryId(null);
      setShowDeleteModal(false);
      toast.success("Inquiry archived successfully");
    } catch (err) {
      toast.error("Failed to archive inquiry");
    } finally {
      setDeleting(false);
    }
  };

  const confirmDeleteReply = (id: string) => {
    setReplyToDeleteId(id);
    setShowReplyDeleteModal(true);
  };

  const handleDeleteReply = async () => {
    if (!activeInquiryId || !replyToDeleteId) return;
    try {
      if (mode === 'support') {
        await InquiryService.deleteReply(activeInquiryId, replyToDeleteId);
      } else {
        await ListingInquiryService.deleteReply(activeInquiryId, replyToDeleteId);
      }
      setInquiries(prev => prev.map(i => i._id === activeInquiryId ? { ...i, replies: i.replies.filter((r: any) => r._id !== replyToDeleteId) } : i));
      setShowReplyDeleteModal(false);
      setReplyToDeleteId(null);
      toast.success("Reply message removed");
    } catch (err) {
      toast.error("Failed to delete reply");
    }
  };

  return (
    <div className="flex h-[calc(100vh-130px)] bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <InquirySidebar 
        mode={mode}
        setMode={(m) => { setMode(m); setFilter('all'); }}
        inqStats={inqStats}
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        loading={loading}
        filtered={filtered}
        activeInquiry={activeInquiry}
        handleSelect={handleSelect}
        getAvatarBg={getAvatarBg}
        getInitials={getInitials}
        INQUIRY_STATUS={INQUIRY_STATUS}
        onRefresh={fetchInquiries}
      />

      {activeInquiry ? (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/20 dark:bg-slate-900/40">
          <ThreadHeader 
            activeInquiry={activeInquiry}
            mode={mode}
            updating={updating}
            handleStatusChange={handleStatusChange}
            handlePriorityChange={handlePriorityChange}
            setShowDeleteModal={setShowDeleteModal}
            getAvatarBg={getAvatarBg}
            getInitials={getInitials}
          />

          <MessageThread 
            activeInquiry={activeInquiry}
            mode={mode}
            confirmDeleteReply={confirmDeleteReply}
          />

          <ReplyArea 
            reply={reply}
            setReply={setReply}
            sendingReply={sendingReply}
            attachments={attachments}
            setAttachments={setAttachments}
            handleReply={handleReply}
            mode={mode}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/20 dark:bg-slate-900/10">
          <div className="w-16 h-16 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm mb-4">
            <InboxIcon className="w-8 h-8 text-slate-200 animate-pulse" />
          </div>
          <p className="text-[17px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Select a thread to view discussion</p>
          <p className="text-[12px] font-bold text-slate-400 mt-1 max-w-[250px]">Choose from support tickets or property inquiries on the left.</p>
        </div>
      )}

      {/* Modals */}
      <ConfirmationModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={confirmDeleteInquiry} 
        title="Archive Inquiry" 
        message="Are you sure you want to move this inquiry to archives? This maintains record integrity but removes it from active list." 
        isLoading={deleting} 
      />

      <ConfirmationModal 
        isOpen={showReplyDeleteModal} 
        onClose={() => setShowReplyDeleteModal(false)} 
        onConfirm={handleDeleteReply} 
        title="Delete Message" 
        message="Permanent remove this message from the communication record?" 
      />
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Inbox as InboxIcon } from "lucide-react";
import { ListingInquiryService } from "@/services/listingInquiry.service";
import { toast } from "react-toastify";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

import { InboxSidebar } from "./inbox/InboxSidebar";
import { InboxThreadHeader } from "./inbox/InboxThreadHeader";
import { InboxMessageThread } from "./inbox/InboxMessageThread";
import { InboxReplyArea } from "./inbox/InboxReplyArea";

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

export function Inbox() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const [replyToDelete, setReplyToDelete] = useState<string | null>(null);
  const [deletingReply, setDeletingReply] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await ListingInquiryService.getMyInquiries();
      if (res.success) {
        setInquiries(res.data);
        if (res.data.length > 0 && !selectedId) {
          setSelectedId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
      toast.error("Could not load your inquiries.");
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    const inq = inquiries.find((i) => i._id === id);
    if (inq && inq.status === "unread") {
      try {
        await ListingInquiryService.markAsRead(id);
        setInquiries((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: "read" } : item,
          ),
        );
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const handleReply = async () => {
    if (!selectedId || !reply.trim()) return;
    if (attachments.length > 5) {
      return toast.error("Maximum 5 attachments allowed.");
    }

    try {
      setSendingReply(true);
      await ListingInquiryService.replyToInquiry(selectedId, reply, attachments);
      toast.success("Reply recorded and email sent");
      setReply("");
      setAttachments([]);
      fetchInquiries();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleStatusChange = async (status: string) => {
    if (!selectedId) return;
    try {
      setLoadingStatus(true);
      await ListingInquiryService.updateStatus(selectedId, status);
      setInquiries((prev) =>
        prev.map((item) =>
          item._id === selectedId ? { ...item, status } : item,
        ),
      );
      toast.success(`Inquiry marked as ${status}`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setLoadingStatus(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      setDeleting(true);
      await ListingInquiryService.deleteInquiry(selectedId);
      toast.success("Inquiry deleted successfully");
      setInquiries((prev) => prev.filter((i) => i._id !== selectedId));
      setSelectedId(null);
      setShowDeleteModal(false);
    } catch (err) {
      toast.error("Could not delete inquiry.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteReply = async () => {
    if (!selectedId || !replyToDelete) return;
    try {
       setDeletingReply(true);
       await ListingInquiryService.deleteReply(selectedId, replyToDelete);
       toast.success("Reply history removed");
       fetchInquiries();
       setReplyToDelete(null);
    } catch (error: any) {
       toast.error("Failed to delete reply.");
    } finally {
       setDeletingReply(false);
    }
  };

  const filtered = useMemo(() => {
    return inquiries.filter((c) => {
      const matchSearch =
        c.senderName?.toLowerCase().includes(search.toLowerCase()) ||
        c.listing?.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.message?.toLowerCase().includes(search.toLowerCase());
      
      if (filter === "unread") return matchSearch && c.status === "unread";
      if (filter === "read") return matchSearch && c.status === "read";
      return matchSearch;
    });
  }, [inquiries, search, filter]);

  const selectedInquiry = useMemo(
    () => inquiries.find((c) => c._id === selectedId),
    [inquiries, selectedId],
  );

  return (
    <div className="flex h-[calc(100vh-130px)] bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <InboxSidebar 
        inquiries={inquiries}
        selectedId={selectedId}
        search={search}
        setSearch={setSearch}
        loading={loading}
        filter={filter}
        setFilter={setFilter}
        filtered={filtered}
        handleSelect={handleSelect}
        fetchInquiries={fetchInquiries}
      />

      {selectedInquiry ? (
        <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#fbfcfd] dark:bg-slate-950/20">
          <InboxThreadHeader 
            selected={selectedInquiry}
            getAvatarBg={getAvatarBg}
            setShowDeleteModal={setShowDeleteModal}
            handleStatusChange={handleStatusChange}
            loadingStatus={loadingStatus}
          />

          <InboxMessageThread 
            selected={selectedInquiry}
            setReplyToDelete={(id) => setReplyToDelete(id)}
          />

          <InboxReplyArea 
            reply={reply}
            setReply={setReply}
            sendingReply={sendingReply}
            attachments={attachments}
            setAttachments={setAttachments}
            handleReply={handleReply}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/20 dark:bg-slate-900/10">
           <div className="w-16 h-16 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm mb-4">
             <InboxIcon className="w-8 h-8 text-slate-200 animate-pulse" />
           </div>
           <p className="text-[17px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Lead Console</p>
           <p className="text-[12px] font-bold text-slate-400 mt-1 max-w-[200px]">Select a property lead from the sidebar to start discussing.</p>
        </div>
      )}

      {/* Modals */}
      <ConfirmationModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={confirmDelete} 
        title="Remove Lead" 
        message="Are you sure you want to delete this property lead? This is irreversible." 
        isLoading={deleting} 
      />

      <ConfirmationModal 
        isOpen={!!replyToDelete} 
        onClose={() => setReplyToDelete(null)} 
        onConfirm={handleDeleteReply} 
        title="Delete Message" 
        message="Permanent remove this message from your records?" 
        isLoading={deletingReply} 
      />
    </div>
  );
}

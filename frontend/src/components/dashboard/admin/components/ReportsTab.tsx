"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Flag, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  User,
  Calendar,
  ShieldCheck,
  Search,
  ChevronDown,
  Building2,
  Trash2,
  MoreVertical,
  Eye,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { ReportService } from "@/services/report.service";
import { DeleteReportModal } from "./DeleteReportModal";
import { ViewReportModal } from "./ViewReportModal";

export interface ListingReport {
  _id: string;
  listing: {
    _id: string;
    title: string;
    price: number;
    location: string;
    images: string[];
    currency: string;
  };
  reporter: {
    _id: string;
    name: string;
    email: string;
  };
  reason: string;
  description: string;
  status: "pending" | "resolved" | "ignored";
  createdAt: string;
}

export function ReportsTab() {
  const [reports, setReports] = useState<ListingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<ListingReport | null>(null);
  const [reportToView, setReportToView] = useState<ListingReport | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await ReportService.getAllReports();
      const data = Array.isArray(res) ? res : (res.data || []);
      setReports(data);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleUpdateStatus = async (reportId: string, status: "resolved" | "ignored") => {
    setActionLoadingId(reportId);
    setOpenMenuId(null);
    try {
      await ReportService.updateReportStatus(reportId, status);
      toast.success(`Report marked as ${status}`);
      await fetchReports();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm("Are you sure you want to delete this report permanently?")) return;
    setActionLoadingId(reportId);
    setOpenMenuId(null);
    try {
      await ReportService.deleteReport(reportId);
      toast.success("Report deleted successfully");
      await fetchReports();
    } catch (error) {
      toast.error("Failed to delete report");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = reports.filter(r => {
    const matchesStatus = statusFilter === "all" ? true : r.status === statusFilter;
    const searchLow = search.toLowerCase();
    const titleMatch = r.listing?.title?.toLowerCase().includes(searchLow);
    const reporterMatch = r.reporter?.name?.toLowerCase().includes(searchLow);
    const reasonMatch = r.reason?.toLowerCase().includes(searchLow);
    
    return matchesStatus && (titleMatch || reporterMatch || reasonMatch || search === "");
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40";
      case "resolved": return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40";
      case "ignored": return "border-slate-200 bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
      default: return "border-slate-200 bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{reports.filter(r => r.status === "pending").length}</p>
            </div>
            <div className="w-10 h-10 rounded-sm bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                <Clock size={20} />
            </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Resolved</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{reports.filter(r => r.status === "resolved").length}</p>
            </div>
            <div className="w-10 h-10 rounded-sm bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={20} />
            </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{reports.length}</p>
            </div>
            <div className="w-10 h-10 rounded-sm bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-600">
                <Flag size={20} />
            </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-royal-400 transition"
          />
        </div>
        <div className="relative shrink-0 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[13px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="ignored">Ignored</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-slate-900 rounded-sm border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {loading && reports.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center">
             <Loader2 className="w-8 h-8 text-royal-600 animate-spin" />
             <p className="mt-4 text-[13px] font-bold text-slate-500">Fetching records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center text-slate-400">
             <ShieldCheck size={40} className="mx-auto mb-4 opacity-20" />
             <p className="font-bold text-[14px]">No reports matched</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[30%]">Reported Property</th>
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[20%]">Reason & Details</th>
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[20%]">Filed By</th>
                  <th className="text-left px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[10%]">Date</th>
                  <th className="text-center px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[15%]">Status</th>
                  <th className="text-center px-4 py-3 font-black text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-widest w-[5%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((report, rowIndex) => {
                  const acting = actionLoadingId === report._id;
                  const dropUp = rowIndex >= filtered.length - 2 && filtered.length > 2;

                  return (
                    <tr key={report._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 rounded-sm bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                              <img 
                                src={report.listing?.images?.[0] || "/placeholder.jpg"} 
                                className="w-full h-full object-cover" 
                                alt="" 
                              />
                           </div>
                           <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{report.listing?.title || "Unknown Property"}</p>
                              <a 
                                href={`/properties/${report.listing?._id}`} 
                                target="_blank"
                                className="text-[11px] font-bold text-royal-600 hover:underline flex items-center gap-1 mt-0.5"
                              >
                                 View Listing <ExternalLink size={10} />
                              </a>
                           </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                         <div className="flex items-center gap-1.5 text-rose-600 mb-1">
                            <AlertTriangle size={12} />
                            <span className="font-bold uppercase text-[11px] tracking-tight">{report.reason}</span>
                         </div>
                         <p className="text-[12px] text-slate-500 leading-tight italic truncate max-w-[150px]" title={report.description}>
                            "{report.description || "No description provided."}"
                         </p>
                      </td>
                      <td className="px-4 py-4">
                         <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                               {report.reporter?.name?.charAt(0) || <User size={12} />}
                            </div>
                            <div className="min-w-0">
                               <p className="font-bold text-slate-800 dark:text-white truncate whitespace-nowrap">{report.reporter?.name}</p>
                               <p className="text-[10px] text-slate-500 truncate whitespace-nowrap">{report.reporter?.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-4 py-4 text-[11.5px] text-slate-500 whitespace-nowrap">
                         {format(new Date(report.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-4 text-center">
                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusBadge(report.status)}`}>
                            {report.status === 'pending' && <Clock size={10} />}
                            {report.status === 'resolved' && <CheckCircle2 size={10} />}
                            {report.status === 'ignored' && <Trash2 size={10} />}
                            {report.status}
                         </span>
                      </td>
                      <td className="px-4 py-4">
                         <div className="relative flex justify-center" ref={openMenuId === report._id ? menuRef : undefined}>
                            {/* 3-dot trigger */}
                            <button
                              onClick={() => setOpenMenuId(openMenuId === report._id ? null : report._id)}
                              className="p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
                              title="Actions"
                            >
                              {acting ? (
                                <Loader2 className="w-4 h-4 animate-spin text-royal-500" />
                              ) : (
                                <MoreVertical className="w-4 h-4" />
                              )}
                            </button>

                            {/* Dropdown Menu */}
                            {openMenuId === report._id && (
                              <div className={`absolute right-0 z-50 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm shadow-lg shadow-slate-200/60 dark:shadow-slate-900/80 overflow-hidden animate-in fade-in duration-150 ${
                                dropUp 
                                  ? "bottom-8 slide-in-from-bottom-1" 
                                  : "top-8 slide-in-from-top-1"
                              }`}>
                                {/* View Details */}
                                <button
                                  onClick={() => {
                                    setReportToView(report);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                                  View Full Report
                                </button>

                                {/* Resolve Button */}
                                {report.status !== "resolved" && (
                                  <button
                                    onClick={() => handleUpdateStatus(report._id, "resolved")}
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer text-left"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Mark Resolved
                                  </button>
                                )}

                                {/* Ignore Button */}
                                {report.status !== "ignored" && (
                                  <button
                                    onClick={() => handleUpdateStatus(report._id, "ignored")}
                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Ignore Report
                                  </button>
                                )}

                                <div className="border-t border-slate-100 dark:border-slate-800" />

                                {/* Delete Button */}
                                <button
                                  onClick={() => setReportToDelete(report)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer text-left"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete Permanently
                                </button>
                              </div>
                            )}
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {reportToDelete && (
        <DeleteReportModal 
          reportTitle={reportToDelete.listing?.title || "Unknown Property"}
          onConfirm={() => handleDeleteReport(reportToDelete._id)}
          onCancel={() => setReportToDelete(null)}
        />
      )}

      {/* View Details Modal */}
      {reportToView && (
        <ViewReportModal 
          report={reportToView}
          onClose={() => setReportToView(null)}
        />
      )}
    </div>
  );
}

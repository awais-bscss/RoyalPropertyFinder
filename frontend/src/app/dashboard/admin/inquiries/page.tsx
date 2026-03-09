"use client";

import { AdminPanel } from "@/components/dashboard/admin";
import { InquiriesTab } from "@/components/dashboard/admin/components/InquiriesTab";

export default function AdminInquiriesPage() {
  return <AdminPanel>{() => <InquiriesTab />}</AdminPanel>;
}

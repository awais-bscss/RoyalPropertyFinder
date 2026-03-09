"use client";

import { AdminPanel } from "@/components/dashboard/admin";
import { ConfigTab } from "@/components/dashboard/admin/components/ConfigTab";

export default function AdminConfigPage() {
  return <AdminPanel>{() => <ConfigTab />}</AdminPanel>;
}

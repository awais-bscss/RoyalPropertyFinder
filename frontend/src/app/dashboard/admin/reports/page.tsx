"use client";

import { AdminPanel } from "@/components/dashboard/admin";
import { ReportsTab } from "@/components/dashboard/admin/components/ReportsTab";

export default function AdminReportsPage() {
  return (
    <AdminPanel>
      {() => (
        <ReportsTab />
      )}
    </AdminPanel>
  );
}

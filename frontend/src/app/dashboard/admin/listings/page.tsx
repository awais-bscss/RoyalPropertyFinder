"use client";

import { AdminPanel } from "@/components/dashboard/admin";
import { ListingsTab } from "@/components/dashboard/admin/components/ListingsTab";

export default function AdminListingsPage() {
  return (
    <AdminPanel>
      {(ctx) => (
        <ListingsTab
          listings={ctx.listings}
          loading={ctx.listingsLoading}
          actionLoading={ctx.actionLoading}
          onApprove={ctx.onApprove}
          onReject={ctx.onReject}
          onToggleRoyalProject={ctx.onToggleRoyalProject}
          statusFilter={ctx.statusFilter}
          setStatusFilter={ctx.setStatusFilter}
          search={ctx.search}
          setSearch={ctx.setSearch}
        />
      )}
    </AdminPanel>
  );
}

"use client";

import { AdminPanel } from "@/components/dashboard/admin";
import { OverviewTab } from "@/components/dashboard/admin/components/OverviewTab";

export default function AdminOverviewPage() {
  return (
    <AdminPanel>
      {(ctx) => (
        <OverviewTab
          listingStats={ctx.listingStats}
          platformStats={ctx.platformStats}
          recentListings={ctx.listings}
          onViewAllListings={ctx.navigateToListings}
          onViewAllUsers={ctx.navigateToUsers}
        />
      )}
    </AdminPanel>
  );
}

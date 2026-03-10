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
          recentUsers={ctx.users}
          recentInquiries={ctx.inquiries}
          inquiryStats={ctx.inquiryStats}
          onViewAllListings={ctx.navigateToListings}
          onViewAllUsers={ctx.navigateToUsers}
          onViewAllInquiries={ctx.navigateToInquiries}
        />
      )}
    </AdminPanel>
  );
}

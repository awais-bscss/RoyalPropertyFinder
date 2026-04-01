"use client";

import { AdminPanel } from "@/components/dashboard/admin";
import { OrdersTab } from "@/components/dashboard/admin/components/OrdersTab";

export default function AdminOrdersPage() {
  return <AdminPanel>{() => <OrdersTab />}</AdminPanel>;
}

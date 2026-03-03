"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { DashboardHome } from "@/components/dashboard/DashboardHome";

export default function DashboardIndexPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return <DashboardHome user={user} />;
}

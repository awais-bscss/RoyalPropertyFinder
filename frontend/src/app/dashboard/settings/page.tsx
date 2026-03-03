"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Settings } from "@/components/dashboard/Settings";

export default function SettingsPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return <Settings user={user} />;
}

"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function AuthToastWatcher() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const loginStatus = searchParams.get("login");
    
    if (loginStatus === "success") {
      toast.success("Welcome back! Login successful.");
      
      // Clear the query parameter from the URL without refresh
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
    
    if (loginStatus === "error") {
      toast.error("Authentication failed. Please try again.");
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, router]);

  return null;
}

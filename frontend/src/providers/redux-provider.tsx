"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { AuthService } from "@/services/auth.service";
import { setAuth, logoutAuth } from "@/store/slices/authSlice";

// A wrapper provider that silently restores auth session on every page load
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Fix: Facebook OAuth appends '#_=_' to the redirect URL (legacy behavior).
  // Strip it silently without a page reload so the URL stays clean.
  useEffect(() => {
    if (window.location.hash === "#_=_") {
      window.history.replaceState(
        null,
        document.title,
        window.location.href.split("#")[0],
      );
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await AuthService.getMe();
        if (res.success && res.data) {
          store.dispatch(setAuth(res.data));
          // ✅ No toast here — session restore is silent.
          // The "Welcome back!" toast is shown only on actual login (LoginModal).
        } else {
          store.dispatch(logoutAuth());
        }
      } catch (error) {
        store.dispatch(logoutAuth());
      }
    };
    fetchUser();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

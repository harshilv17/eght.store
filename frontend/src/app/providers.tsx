"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { initApiClient, authApi } from "@/lib/api";
import { regenerateSessionId } from "@/lib/session";
import { mapUser } from "@/lib/auth-utils";
import { Toaster } from "@/components/ui/Toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const { setAuth, clear, setBootstrapping } = useAuthStore();
  const bootstrapped = useRef(false);

  // Wire up API client token getter + logout handler
  useEffect(() => {
    initApiClient(
      () => useAuthStore.getState().accessToken,
      () => {
        clear();
        regenerateSessionId();
        window.location.href = "/account/login";
      }
    );
  }, [clear]);

  // Silent refresh on mount — establish session
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    authApi
      .refresh()
      .then(async ({ accessToken: token }) => {
        const { user: rawUser } = await authApi.me();
        setAuth(mapUser(rawUser), token);
      })
      .catch(() => {
        // Not logged in — stay as guest
      })
      .finally(() => {
        setBootstrapping(false);
      });
  }, [setAuth, setBootstrapping]);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useFxStore } from "@/store/fx.store";
import { initApiClient, authApi, configApi } from "@/lib/api";
import { regenerateSessionId } from "@/lib/session";
import { mapUser } from "@/lib/auth-utils";
import { Toaster } from "@/components/ui/Toaster";

function readCountryCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )country=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const { setAuth, clear, setBootstrapping } = useAuthStore();
  const setFxConfig = useFxStore((s) => s.setConfig);
  const setFxCountry = useFxStore((s) => s.setCountry);
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

    const cookieCountry = readCountryCookie();
    if (cookieCountry) setFxCountry(cookieCountry);

    configApi
      .fx()
      .then((config) => {
        setFxConfig(config);
        if (!cookieCountry) setFxCountry(config.defaultCountry);
      })
      .catch(() => {
        // FX not loaded — UI falls back to INR rendering
      });

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
  }, [setAuth, setBootstrapping, setFxConfig, setFxCountry]);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

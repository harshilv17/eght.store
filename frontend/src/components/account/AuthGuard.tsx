"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isBootstrapping } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isBootstrapping && !user) {
      router.replace(`/account/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [user, isBootstrapping, router, pathname]);

  if (isBootstrapping || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--color-outline-variant)] border-t-[var(--color-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

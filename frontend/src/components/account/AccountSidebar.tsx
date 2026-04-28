"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { authApi, cartApi } from "@/lib/api";
import { regenerateSessionId } from "@/lib/session";
import { mapCartResponse } from "@/lib/cart-utils";

const NAV = [
  { label: "Orders", href: "/account/orders" },
  { label: "Addresses", href: "/account/addresses" },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clear } = useAuthStore();
  const { setItems, clear: clearCart } = useCartStore();

  async function handleLogout() {
    try {
      await authApi.logout();
    } catch {
      // ignore — still clear local state
    }
    clear();
    regenerateSessionId();
    clearCart();
    const freshCart = await cartApi.get().catch(() => null);
    if (freshCart) {
      const { items, subtotal } = mapCartResponse(freshCart);
      setItems(items, subtotal);
    }
    router.replace("/");
  }

  return (
    <aside className="w-full md:w-56 shrink-0">
      {user && (
        <div className="mb-6">
          <p className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface)]">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-body-md text-[var(--color-on-surface-variant)] mt-0.5">
            {user.email}
          </p>
        </div>
      )}

      <nav className="flex flex-col gap-1" aria-label="Account navigation">
        {NAV.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`text-label-caps font-bold uppercase tracking-widest py-2 border-b transition-colors ${
              pathname === href
                ? "text-[var(--color-on-surface)] border-[var(--color-primary)]"
                : "text-[var(--color-on-surface-variant)] border-transparent hover:text-[var(--color-on-surface)]"
            }`}
          >
            {label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="text-left text-label-caps font-bold uppercase tracking-widest py-2 border-b border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] transition-colors mt-4"
        >
          Sign Out
        </button>
      </nav>
    </aside>
  );
}

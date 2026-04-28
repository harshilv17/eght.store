"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart.store";

export function EmptyCart() {
  const { close } = useCartStore();

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 px-10 text-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-[var(--color-outline)]"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      <div>
        <p className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface)]">
          Your bag is empty
        </p>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mt-1">
          Add pieces to get started.
        </p>
      </div>
      <Link
        href="/collections"
        onClick={close}
        className="text-label-caps font-bold uppercase tracking-widest border-b border-[var(--color-primary)] pb-0.5 hover:text-[var(--color-on-tertiary-container)] hover:border-[var(--color-on-tertiary-container)] transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { useFxStore } from "@/store/fx.store";
import { formatCurrency } from "@/lib/format";

export function CartFooter() {
  const { subtotal, close } = useCartStore();
  const fxConvert = useFxStore((s) => s.convert);
  const display = fxConvert(subtotal);

  return (
    <div className="shrink-0 border-t border-[var(--color-outline-variant)] px-6 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">
          Subtotal
        </span>
        <span className="text-body-lg font-bold text-[var(--color-on-surface)]">
          {formatCurrency(display.amount, display.currency)}
        </span>
      </div>
      <p className="text-body-md text-[var(--color-on-surface-variant)] -mt-2">
        Shipping and taxes calculated at checkout.
      </p>
      <Link
        href="/checkout"
        onClick={close}
        className="w-full py-4 px-8 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-label-caps font-bold uppercase tracking-widest text-center hover:bg-[var(--color-surface-tint)] transition-colors"
      >
        Checkout
      </Link>
    </div>
  );
}

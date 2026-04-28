"use client";

import { useCartStore } from "@/store/cart.store";
import { Drawer } from "@/components/ui/Drawer";
import { CartItemRow } from "./CartItemRow";
import { CartFooter } from "./CartFooter";
import { EmptyCart } from "./EmptyCart";

export function CartDrawer() {
  const { isOpen, close, items, isLoading } = useCartStore();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Drawer open={isOpen} onClose={close} label="Shopping bag" side="right">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-outline-variant)] shrink-0">
        <h2 className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface)]">
          Your Bag{itemCount > 0 ? ` (${itemCount})` : ''}
        </h2>
        <button
          onClick={close}
          aria-label="Close bag"
          className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[var(--color-outline-variant)] border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-6">
            {items.map((item) => (
              <CartItemRow key={item.variantId} item={item} />
            ))}
          </div>
          <CartFooter />
        </>
      )}
    </Drawer>
  );
}

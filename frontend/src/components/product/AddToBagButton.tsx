"use client";

import { useState } from "react";
import { CartItem, useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";
import { cartApi } from "@/lib/api";
import { mapCartResponse } from "@/lib/cart-utils";

interface AddToBagButtonProps {
  item: Omit<CartItem, 'id'> | null;
  disabled?: boolean;
}

export function AddToBagButton({ item, disabled }: AddToBagButtonProps) {
  const [loading, setLoading] = useState(false);
  const { addItemOptimistic, setItems, open: openCart } = useCartStore();
  const { addToast } = useUiStore();

  const isDisabled = disabled || !item || loading;

  async function handleClick() {
    if (!item) return;
    setLoading(true);

    const optimisticItem: CartItem = { ...item, id: `temp-${Date.now()}` };
    addItemOptimistic(optimisticItem);

    try {
      await cartApi.add(item.variantId, 1);
      const cart = await cartApi.get();
      const { items, subtotal } = mapCartResponse(cart);
      setItems(items, subtotal);
      openCart();
      addToast({ tone: 'success', title: 'Added to bag', description: item.name });
    } catch (err) {
      // Revert optimistic add
      const cart = await cartApi.get().catch(() => null);
      if (cart) {
        const { items, subtotal } = mapCartResponse(cart);
        setItems(items, subtotal);
      }
      const message = err instanceof Error ? err.message : 'Could not add to bag';
      addToast({ tone: 'error', title: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`w-full py-4 px-8 text-label-caps uppercase tracking-widest mt-4 transition-colors flex items-center justify-center gap-2 ${
        isDisabled
          ? "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] cursor-not-allowed"
          : "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-surface-tint)]"
      }`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {!item ? "SELECT A SIZE" : loading ? "ADDING..." : "ADD TO BAG"}
    </button>
  );
}

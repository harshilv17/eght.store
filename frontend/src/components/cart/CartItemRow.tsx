"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem, useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";
import { cartApi } from "@/lib/api";
import { mapCartResponse } from "@/lib/cart-utils";
import { CartApiResponse } from "@/types/cart";
import { formatCurrency } from "@/lib/format";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQtyOptimistic, removeItemOptimistic, setItems, close } = useCartStore();
  const { addToast } = useUiStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const image = item.images[0] ?? null;

  function scheduleSync(variantId: string, newQty: number) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        if (newQty === 0) {
          await cartApi.remove(variantId);
        } else {
          await cartApi.update(variantId, newQty);
        }
        const cart = await cartApi.get();
        const { items, subtotal } = mapCartResponse(cart);
        setItems(items, subtotal);
      } catch {
        const cart = await cartApi.get().catch(() => null);
        if (cart) {
          const { items, subtotal } = mapCartResponse(cart as CartApiResponse);
          setItems(items, subtotal);
        }
        addToast({ tone: 'error', title: 'Could not update cart' });
      }
    }, 300);
  }

  function handleIncrement() {
    if (item.quantity >= item.stockQty) return;
    const newQty = item.quantity + 1;
    updateQtyOptimistic(item.variantId, newQty);
    scheduleSync(item.variantId, newQty);
  }

  function handleDecrement() {
    const newQty = item.quantity - 1;
    if (newQty === 0) {
      removeItemOptimistic(item.variantId);
    } else {
      updateQtyOptimistic(item.variantId, newQty);
    }
    scheduleSync(item.variantId, newQty);
  }

  function handleRemove() {
    removeItemOptimistic(item.variantId);
    cartApi.remove(item.variantId)
      .then(() => cartApi.get())
      .then((cart) => {
        const { items, subtotal } = mapCartResponse(cart);
        setItems(items, subtotal);
      })
      .catch(() => {
        addToast({ tone: 'error', title: 'Could not remove item' });
      });
  }

  return (
    <div className="flex gap-4 py-5 border-b border-[var(--color-outline-variant)] last:border-0">
      {/* Image */}
      <div className="relative w-20 h-24 shrink-0 bg-[var(--color-surface-container)]">
        {image ? (
          <Image
            src={image}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-outline)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" />
              <path d="M3 9l4-4 4 4 4-4 4 4" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.slug}`}
            onClick={close}
            className="text-label-caps font-bold uppercase tracking-widest text-[var(--color-on-surface)] hover:text-[var(--color-on-tertiary-container)] transition-colors line-clamp-2"
          >
            {item.name}
          </Link>
          <button
            onClick={handleRemove}
            aria-label={`Remove ${item.name} from bag`}
            className="shrink-0 text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="text-body-md text-[var(--color-on-surface-variant)]">
          {item.size}{item.color ? ` · ${item.color}` : ''}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          {/* Qty controls */}
          <div className="flex items-center border border-[var(--color-outline-variant)]">
            <button
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span
              aria-label={`Quantity: ${item.quantity}`}
              className="w-8 h-8 flex items-center justify-center text-label-caps font-bold text-[var(--color-on-surface)]"
            >
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= item.stockQty}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          <p className="text-body-md font-bold text-[var(--color-on-surface)]">
            {formatCurrency(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}

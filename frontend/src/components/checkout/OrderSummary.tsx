"use client";

import Image from "next/image";
import { CartItem } from "@/store/cart.store";
import { formatCurrency } from "@/lib/format";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingPrice: number;
}

export function OrderSummary({ items, subtotal, shippingPrice }: OrderSummaryProps) {
  const total = subtotal + shippingPrice;

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.variantId} className="flex gap-4">
            <div className="relative w-16 h-20 flex-shrink-0 bg-[var(--color-surface-container)]">
              {item.images[0] ? (
                <Image
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full bg-[var(--color-surface-container-high)]" />
              )}
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--color-on-surface-variant)] text-[var(--color-inverse-on-surface)] text-xs flex items-center justify-center font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
              <p className="text-body-md font-semibold truncate">{item.name}</p>
              <p className="text-body-md text-[var(--color-on-surface-variant)]">
                {item.size}{item.color ? ` / ${item.color}` : ""}
              </p>
            </div>
            <p className="text-body-md font-semibold flex-shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="border-t border-[var(--color-outline-variant)] pt-4 flex flex-col gap-3">
        <div className="flex justify-between text-body-md">
          <span className="text-[var(--color-on-surface-variant)]">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-body-md">
          <span className="text-[var(--color-on-surface-variant)]">Shipping</span>
          <span>{shippingPrice === 0 ? "FREE" : formatCurrency(shippingPrice)}</span>
        </div>
      </div>

      <div className="border-t border-[var(--color-outline-variant)] pt-4 flex justify-between">
        <span className="text-label-caps font-bold uppercase tracking-widest">Total</span>
        <span className="text-headline-md font-bold">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

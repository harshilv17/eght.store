"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CartItem } from "@/store/cart.store";
import { cartApi } from "@/lib/api";
import { CartTotals } from "@/types/cart";
import { formatPrice, type CountryCode } from "@/lib/country";

interface OrderSummaryProps {
  items: CartItem[];
  country: string;
  pincode?: string;
  onTotalsChange?: (totals: CartTotals) => void;
}

export function OrderSummary({ items, country, pincode, onTotalsChange }: OrderSummaryProps) {
  const [totals, setTotals] = useState<CartTotals | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    cartApi
      .totals({ country, pincode })
      .then((t) => {
        if (cancelled) return;
        setTotals(t);
        setError(null);
        onTotalsChange?.(t);
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [country, pincode, items.length, onTotalsChange]);

  const cc = (n: number) => formatPrice(n, country as CountryCode);

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
              {cc(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="border-t border-[var(--color-outline-variant)] pt-4 flex flex-col gap-3">
        {error && (
          <p className="text-body-md text-[var(--color-error,#b00020)]" role="alert">
            Could not load totals. {error}
          </p>
        )}
        {totals ? (
          <>
            <Row label="Subtotal" value={cc(totals.subtotal)} />
            <Row
              label="Shipping"
              value={totals.shipping === 0 ? "FREE" : cc(totals.shipping)}
            />
            <Row label={totals.taxLabel} value={cc(totals.tax)} />
          </>
        ) : !error ? (
          <p className="text-body-md text-[var(--color-on-surface-variant)]">Calculating…</p>
        ) : null}
      </div>

      {totals && (
        <div className="border-t border-[var(--color-outline-variant)] pt-4 flex justify-between">
          <span className="text-label-caps font-bold uppercase tracking-widest">Total</span>
          <span className="text-headline-md font-bold">{cc(totals.total)}</span>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-body-md">
      <span className="text-[var(--color-on-surface-variant)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}

"use client";

import { formatCurrency } from "@/lib/format";
import { useFxStore } from "@/store/fx.store";

interface PriceTagProps {
  // Server-rendered baseline (INR). Treated as canonical.
  price: number;
  comparePrice?: number | null;
  // Optional pre-converted display values from backend; preferred when present.
  displayPrice?: number;
  displayComparePrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceTag({
  price,
  comparePrice,
  displayPrice,
  displayComparePrice,
  currency,
  size = "md",
  className,
}: PriceTagProps) {
  const meta = useFxStore((s) => s.meta());
  const textClass = size === "lg" ? "text-body-lg" : "text-body-md";

  // Resolution order:
  // 1. Backend display fields (server-converted for cookie country)
  // 2. Client FX store (covers user-switched country before SSR re-fetch)
  // 3. INR canonical
  let shownPrice = displayPrice ?? price;
  let shownCompare = displayComparePrice !== undefined ? displayComparePrice : comparePrice;
  let shownCurrency = currency ?? "INR";

  if (displayPrice == null && meta && meta.currency !== "INR") {
    shownPrice = Math.round(price * meta.fxFromInr * 100) / 100;
    shownCompare = comparePrice != null ? Math.round(comparePrice * meta.fxFromInr * 100) / 100 : null;
    shownCurrency = meta.currency;
  }

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className={`${textClass} font-semibold text-[var(--color-primary)]`}>
        {formatCurrency(shownPrice, shownCurrency)}
      </span>
      {shownCompare != null && shownCompare > shownPrice && (
        <span className={`${textClass} text-[var(--color-on-surface-variant)] line-through`}>
          {formatCurrency(shownCompare, shownCurrency)}
        </span>
      )}
    </div>
  );
}

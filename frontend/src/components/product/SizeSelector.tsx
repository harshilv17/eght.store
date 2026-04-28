"use client";

import { ProductVariant } from "@/types/product";

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedColor: string | null;
  selectedSize: string | null;
  onChange: (size: string) => void;
}

export function SizeSelector({ variants, selectedColor, selectedSize, onChange }: SizeSelectorProps) {
  const relevantVariants = selectedColor
    ? variants.filter((v) => v.color === selectedColor)
    : variants;

  const sizes = Array.from(
    new Set(relevantVariants.map((v) => v.size))
  ).filter(Boolean);

  if (!sizes.length) return null;

  function isOutOfStock(size: string): boolean {
    return relevantVariants
      .filter((v) => v.size === size)
      .every((v) => v.stock_qty === 0);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-label-caps text-[var(--color-primary)]">SIZE</span>
        <button className="text-label-caps text-[var(--color-secondary)] underline hover:text-[var(--color-primary)] transition-colors">
          SIZE GUIDE
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => {
          const oos = isOutOfStock(size);
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              onClick={() => !oos && onChange(size)}
              disabled={oos}
              aria-disabled={oos}
              aria-pressed={isSelected}
              className={`py-3 text-label-caps text-center transition-colors ${
                isSelected
                  ? "border border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                  : oos
                  ? "border border-[var(--color-outline-variant)] text-[var(--color-outline)] cursor-not-allowed"
                  : "border border-[var(--color-outline-variant)] hover:border-[var(--color-primary)]"
              }`}
            >
              {size}
              {oos && <span className="sr-only"> — Out of stock</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

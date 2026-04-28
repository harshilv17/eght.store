import { formatCurrency } from "@/lib/format";

interface PriceTagProps {
  price: number;
  comparePrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceTag({ price, comparePrice, currency = "INR", size = "md", className }: PriceTagProps) {
  const textClass = size === "lg" ? "text-body-lg" : "text-body-md";

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className={`${textClass} font-semibold text-[var(--color-primary)]`}>
        {formatCurrency(price, currency)}
      </span>
      {comparePrice != null && comparePrice > price && (
        <span className={`${textClass} text-[var(--color-on-surface-variant)] line-through`}>
          {formatCurrency(comparePrice, currency)}
        </span>
      )}
    </div>
  );
}

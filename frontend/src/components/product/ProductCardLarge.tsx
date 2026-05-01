import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { PriceTag } from "./PriceTag";

interface ProductCardLargeProps {
  product: Product;
  badge?: string;
  priority?: boolean;
}

export function ProductCardLarge({ product, badge, priority = true }: ProductCardLargeProps) {
  const firstImage = product.images?.[0];
  const derivedBadge = badge ?? (
    product.tags?.includes("new") ? "JUST ADDED" :
    product.tags?.includes("limited") ? "LIMITED DROP" :
    null
  );

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative bg-[var(--color-surface-container-high)] aspect-[4/5] overflow-hidden mb-4">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover grayscale group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 58vw"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-surface-container-highest)]" />
        )}

        {derivedBadge && (
          <div className="absolute top-4 left-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-label-caps px-3 py-1">
            {derivedBadge}
          </div>
        )}

        {product.total_stock === 0 && (
          <div className="absolute inset-0 bg-white/40 flex items-end pb-4 pl-4">
            <span className="text-label-caps text-[var(--color-on-surface-variant)]">SOLD OUT</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <h3 className="text-body-lg text-[var(--color-primary)] font-semibold">{product.name}</h3>
          <p className="text-body-md text-[var(--color-on-surface-variant)]">{product.category_name}</p>
        </div>
        <PriceTag
          price={product.price}
          comparePrice={product.compare_price}
          displayPrice={product.display_price}
          displayComparePrice={product.display_compare_price}
          currency={product.currency}
          size="lg"
          className="shrink-0"
        />
      </div>
    </Link>
  );
}

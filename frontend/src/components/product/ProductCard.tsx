import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { PriceTag } from "./PriceTag";

interface ProductCardProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

export function ProductCard({ product, size = "md", priority = false }: ProductCardProps) {
  const firstImage = product.images?.[0];
  const isSoldOut = product.total_stock === 0;
  const isNew = product.tags?.includes("new");
  const isLimited = product.tags?.includes("limited");
  const badge = isNew ? "JUST ADDED" : isLimited ? "LIMITED DROP" : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative bg-[var(--color-surface-container-high)] aspect-[3/4] overflow-hidden mb-4">
        {firstImage ? (
          <Image
            src={firstImage}
            alt=""
            fill
            priority={priority}
            className="object-cover grayscale group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-surface-container-highest)]" />
        )}

        {badge && (
          <div className="absolute top-4 left-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-label-caps px-3 py-1">
            {badge}
          </div>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 bg-white/40 flex items-end pb-4 pl-4">
            <span className="text-label-caps text-[var(--color-on-surface-variant)]">SOLD OUT</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <h3 className={`${size === "sm" ? "text-body-md" : "text-body-md"} text-[var(--color-primary)] font-semibold truncate`}>
            {product.name}
          </h3>
          <p className="text-body-md text-[var(--color-on-surface-variant)] truncate">
            {product.category_name}
          </p>
        </div>
        <PriceTag
          price={product.price}
          comparePrice={product.compare_price}
          displayPrice={product.display_price}
          displayComparePrice={product.display_compare_price}
          currency={product.currency}
          className="shrink-0"
        />
      </div>
    </Link>
  );
}

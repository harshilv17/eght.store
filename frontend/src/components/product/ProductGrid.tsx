import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  cols?: 2 | 3 | 4;
}

const colClass = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
} as const;

export function ProductGrid({ products, cols = 3 }: ProductGridProps) {
  if (!products.length) {
    return (
      <p className="text-body-md text-[var(--color-on-surface-variant)] text-center py-20">
        No products found.
      </p>
    );
  }

  return (
    <div className={`grid ${colClass[cols]} gap-x-8 gap-y-16`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

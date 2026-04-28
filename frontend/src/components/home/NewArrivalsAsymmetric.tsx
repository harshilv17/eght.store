import Link from "next/link";
import { Product } from "@/types/product";
import { ProductCardLarge } from "@/components/product/ProductCardLarge";
import { ProductCard } from "@/components/product/ProductCard";

interface NewArrivalsAsymmetricProps {
  products: Product[];
}

export function NewArrivalsAsymmetric({ products }: NewArrivalsAsymmetricProps) {
  if (!products.length) return null;

  const [hero, ...rest] = products;
  const stacked = rest.slice(0, 2);
  const remaining = rest.slice(2);

  return (
    <section className="py-[var(--spacing-section-gap)] px-[var(--spacing-margin-edge)]">
      <div className="max-w-[1440px] mx-auto">
        {/* Section header */}
        <div className="flex justify-between items-end mb-16 border-b border-[var(--color-primary)]/10 pb-6">
          <h2 className="text-headline-lg text-[var(--color-primary)]">NEW ARRIVALS</h2>
          <Link
            href="/collections"
            className="text-label-caps text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors tracking-widest"
          >
            VIEW ALL
          </Link>
        </div>

        {/* Asymmetric grid: hero 7 cols + spacer 1 + stack 4 cols */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-gutter)]">
          {/* Large hero card */}
          <div className="md:col-span-7">
            <ProductCardLarge product={hero} badge="JUST ADDED" priority />
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Stacked smaller cards */}
          {stacked.length > 0 && (
            <div className="md:col-span-4 flex flex-col gap-12 md:mt-24">
              {stacked.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i === 0} />
              ))}
            </div>
          )}
        </div>

        {/* Remaining products in a 4-col grid */}
        {remaining.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-gutter)] mt-[var(--spacing-gutter)]">
            {remaining.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

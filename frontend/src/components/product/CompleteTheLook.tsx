import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/format";

interface CompleteTheLookProps {
  products: Product[];
}

export function CompleteTheLook({ products }: CompleteTheLookProps) {
  if (!products.length) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-[var(--spacing-margin-edge)] mb-[var(--spacing-section-gap)]">
      <h2 className="text-headline-md text-[var(--color-primary)] uppercase mb-12 text-center">
        COMPLETE THE LOOK
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-gutter)]">
        {products.slice(0, 3).map((product) => {
          const firstImage = product.images?.[0];
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col gap-4"
            >
              <div className="aspect-[4/5] bg-[var(--color-surface-container-high)] overflow-hidden relative">
                {firstImage ? (
                  <Image
                    src={firstImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-surface-container-highest)]" />
                )}
              </div>
              <div>
                <h3 className="text-label-caps text-[var(--color-primary)] uppercase">{product.name}</h3>
                <p className="text-body-md text-[var(--color-secondary)] mt-1">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

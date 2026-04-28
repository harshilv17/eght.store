import Link from "next/link";
import { Metadata } from "next";
import { Category } from "@/types/product";

export const metadata: Metadata = {
  title: "Collections — EGHT",
  description: "Explore all EGHT Studios collections.",
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as Category[];
  } catch {
    return [];
  }
}

export default async function CollectionsPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-[1440px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      <header className="mb-16 flex flex-col items-center text-center">
        <h1 className="text-headline-lg text-[var(--color-primary)]">COLLECTIONS</h1>
        <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-2xl mt-4">
          Curated drops designed for structural integrity and effortless layering.
        </p>
      </header>

      {categories.length === 0 ? (
        <p className="text-body-md text-[var(--color-on-surface-variant)] text-center py-20">
          No collections available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className="group block bg-[var(--color-surface-container-high)] p-12 hover:bg-[var(--color-surface-container-highest)] transition-colors"
            >
              <h2 className="text-headline-md text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors uppercase">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="text-body-md text-[var(--color-on-surface-variant)] mt-3 line-clamp-2">
                  {cat.description}
                </p>
              )}
              <div className="mt-8 text-label-caps text-[var(--color-accent)] tracking-widest">
                SHOP NOW →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

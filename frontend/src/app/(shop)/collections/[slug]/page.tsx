import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Product, Category } from "@/types/product";

export const dynamic = "force-dynamic";
import { FilterSidebar } from "@/components/collection/FilterSidebar";
import { CollectionGrid } from "@/components/collection/CollectionGrid";

const PAGE_SIZE = 24;

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

async function getProducts(categorySlug: string, search?: string): Promise<Product[]> {
  try {
    const qs = new URLSearchParams({ limit: String(PAGE_SIZE) });
    if (categorySlug !== 'new-arrivals') {
      qs.set("category", categorySlug);
    }
    if (search) qs.set("search", search);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${qs}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as Product[];
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'new-arrivals') {
    return {
      title: "NEW ARRIVALS — EGHT",
      description: "Shop the latest drops at EGHT Studios.",
    };
  }

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  const name = category?.name ?? slug.replace(/-/g, " ").toUpperCase();

  return {
    title: `${name} — EGHT`,
    description: category?.description ?? `Shop ${name} at EGHT Studios.`,
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const [{ slug }, { search }] = await Promise.all([params, searchParams]);

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(slug, search),
  ]);

  const currentCategory = categories.find((c) => c.slug === slug);

  // If we get zero products AND no categories match, treat as 404 (unless it's new-arrivals)
  if (!currentCategory && products.length === 0 && slug !== 'new-arrivals') {
    notFound();
  }

  const name = slug === 'new-arrivals' ? 'NEW ARRIVALS' : (currentCategory?.name ?? slug.replace(/-/g, " ").toUpperCase());
  const description = slug === 'new-arrivals' ? 'Fresh drops and latest additions to the EGHT catalog.' : currentCategory?.description;

  return (
    <div className="max-w-[1440px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      {/* Collection header */}
      <header className="mb-[var(--spacing-section-gap)] flex flex-col items-center text-center">
        <h1
          className="text-[var(--color-primary)] uppercase font-bold"
          style={{ fontSize: "clamp(48px, 8vw, 120px)", letterSpacing: "-0.04em", lineHeight: "100%" }}
        >
          {name}
        </h1>
        {description && (
          <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-2xl mt-6">
            {description}
          </p>
        )}
      </header>

      {/* Content: sidebar + grid */}
      <div className="flex flex-col lg:flex-row gap-[var(--spacing-gutter)]">
        <FilterSidebar categories={categories} currentSlug={slug} />
        <CollectionGrid
          initialProducts={products}
          categorySlug={slug}
          search={search}
        />
      </div>
    </div>
  );
}

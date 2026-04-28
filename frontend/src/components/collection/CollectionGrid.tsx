"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { env } from "@/lib/env";

type SortOption = "newest" | "price-asc" | "price-desc";

interface CollectionGridProps {
  initialProducts: Product[];
  categorySlug: string;
  search?: string;
}

const PAGE_SIZE = 24;

export function CollectionGrid({ initialProducts, categorySlug, search }: CollectionGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === PAGE_SIZE);
  const [sort, setSort] = useState<SortOption>("newest");

  async function loadMore() {
    setLoading(true);
    const nextPage = page + 1;
    try {
      const qs = new URLSearchParams({
        category: categorySlug,
        page: String(nextPage),
        limit: String(PAGE_SIZE),
      });
      if (search) qs.set("search", search);
      const res = await fetch(`${env.apiUrl}/products?${qs}`);
      const json = await res.json();
      const more = (json.data ?? []) as Product[];
      setProducts((prev) => [...prev, ...more]);
      setPage(nextPage);
      setHasMore(more.length === PAGE_SIZE);
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="flex-1 min-w-0">
      {/* Sort bar */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--color-outline-variant)]">
        <span className="text-body-md text-[var(--color-on-surface-variant)]">
          {products.length} {products.length === 1 ? "RESULT" : "RESULTS"}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-label-caps">SORT BY</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-transparent border-none text-body-md text-[var(--color-primary)] cursor-pointer focus:outline-none p-0 pr-6"
          >
            <option value="newest">NEWEST ARRIVALS</option>
            <option value="price-desc">PRICE: HIGH TO LOW</option>
            <option value="price-asc">PRICE: LOW TO HIGH</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <p className="text-body-md text-[var(--color-on-surface-variant)] text-center py-20">
          No products found in this collection.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-20 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-label-caps px-12 py-4 hover:bg-[var(--color-inverse-surface)] transition-colors disabled:opacity-50"
          >
            {loading ? "LOADING..." : "LOAD MORE"}
          </button>
        </div>
      )}
    </div>
  );
}

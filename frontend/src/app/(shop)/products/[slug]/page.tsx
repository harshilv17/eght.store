import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail, Product } from "@/types/product";

export const dynamic = "force-dynamic";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetailClient } from "./ProductDetailClient";
import { CompleteTheLook } from "@/components/product/CompleteTheLook";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";

async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as ProductDetail;
  } catch {
    return null;
  }
}

async function getRelatedProducts(categorySlug: string, excludeSlug: string): Promise<Product[]> {
  try {
    const qs = new URLSearchParams({ category: categorySlug, limit: "4" });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${qs}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const all = (json.data ?? []) as Product[];
    return all.filter((p) => p.slug !== excludeSlug).slice(0, 3);
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product — EGHT" };

  return {
    title: `${product.name} — EGHT`,
    description: product.description ?? `Shop ${product.name} at EGHT Studios.`,
    openGraph: {
      images: product.images?.length ? [product.images[0]] : [],
      title: `${product.name} — EGHT`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — EGHT`,
      images: product.images?.length ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_slug, slug);

  return (
    <>
      <ProductJsonLd product={product} />
      <main className="max-w-[1440px] mx-auto px-[var(--spacing-margin-edge)] mt-20 mb-[var(--spacing-section-gap)]">
        <div className="grid grid-cols-12 gap-[var(--spacing-gutter)]">
          {/* Gallery — 8 cols */}
          <div className="col-span-12 md:col-span-8">
            <ProductGallery images={product.images ?? []} alt={product.name} />
          </div>

          {/* Info panel — 4 cols, sticky */}
          <div className="col-span-12 md:col-span-4">
            <div className="sticky top-32">
              <ProductDetailClient product={product} />
            </div>
          </div>
        </div>
      </main>

      {related.length > 0 && <CompleteTheLook products={related} />}
    </>
  );
}

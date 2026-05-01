import { Product } from "@/types/product";

interface CollectionJsonLdProps {
  name: string;
  description?: string | null;
  slug: string;
  products: Product[];
}

export function CollectionJsonLd({ name, description, slug, products }: CollectionJsonLdProps) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eght.studio";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description: description ?? undefined,
    url: `${BASE_URL}/collections/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 24).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE_URL}/products/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

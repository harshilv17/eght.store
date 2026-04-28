import { ProductDetail } from "@/types/product";

interface ProductJsonLdProps {
  product: ProductDetail;
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eght.studio";

  const inStock = product.total_stock > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.images ?? [],
    sku: product.variants?.[0]?.sku,
    url: `${BASE_URL}/products/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "EGHT Studios",
    },
    offers: product.variants?.length
      ? product.variants.map((v) => ({
          "@type": "Offer",
          sku: v.sku,
          price: product.price,
          priceCurrency: "INR",
          availability:
            v.stock_qty > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: "EGHT Studios" },
        }))
      : [
          {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "Organization", name: "EGHT Studios" },
          },
        ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

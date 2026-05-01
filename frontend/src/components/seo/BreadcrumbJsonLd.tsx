interface Crumb {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: Crumb[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eght.studio";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url.startsWith("http") ? crumb.url : `${BASE_URL}${crumb.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

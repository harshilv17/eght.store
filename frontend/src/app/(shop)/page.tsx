import { Hero } from "@/components/home/Hero";
import { NewArrivalsAsymmetric } from "@/components/home/NewArrivalsAsymmetric";
import { ManifestoSection } from "@/components/home/ManifestoSection";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

async function getNewArrivals(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?limit=8`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as Product[];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getNewArrivals();

  return (
    <>
      <Hero />
      <NewArrivalsAsymmetric products={products} />
      <ManifestoSection />
    </>
  );
}

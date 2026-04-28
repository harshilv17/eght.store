import { Skeleton } from "@/components/ui/Skeleton";

export default function ShopLoading() {
  return (
    <div className="max-w-[1440px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      <Skeleton className="h-[60vh] w-full mb-16" />
      <div className="grid grid-cols-12 gap-6">
        <Skeleton className="col-span-12 md:col-span-7 h-96" />
        <div className="col-span-12 md:col-span-1" />
        <Skeleton className="col-span-12 md:col-span-4 h-96" />
      </div>
    </div>
  );
}

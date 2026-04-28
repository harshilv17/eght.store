import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <main className="max-w-[1440px] mx-auto px-[var(--spacing-margin-edge)] mt-20 mb-[var(--spacing-section-gap)]">
      <div className="grid grid-cols-12 gap-6">
        {/* Gallery skeleton */}
        <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6 pt-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-7 w-20" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-8 h-8 rounded-full" />
            ))}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-14 h-10" />
            ))}
          </div>
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </main>
  );
}

import { Skeleton } from "@/components/ui/Skeleton";

export default function CollectionDetailLoading() {
  return (
    <div className="max-w-[1440px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      <div className="flex flex-col items-center mb-16">
        <Skeleton className="h-20 w-80" />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <Skeleton className="w-full lg:w-56 h-96 flex-shrink-0" />
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

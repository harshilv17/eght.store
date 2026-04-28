import { Skeleton } from "@/components/ui/Skeleton";

export default function CollectionsLoading() {
  return (
    <div className="max-w-[1440px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      <div className="flex flex-col items-center mb-16 gap-4">
        <Skeleton className="h-14 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  );
}

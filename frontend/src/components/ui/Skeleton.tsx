interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-surface-container-high)] ${className}`}
      aria-hidden="true"
    />
  );
}

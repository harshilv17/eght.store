export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-label-caps text-[var(--color-on-surface-variant)] animate-pulse">
          LOADING
        </span>
        <div className="w-12 h-px bg-[var(--color-primary)] animate-[grow_1s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

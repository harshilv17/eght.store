"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CollectionsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-10">
      <div className="text-center max-w-md">
        <p className="text-label-caps text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-4">
          Failed to load collection
        </p>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mb-8">
          {error.message || "Could not load this collection. Please try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-label-caps px-6 py-4 hover:opacity-80 transition-opacity"
          >
            TRY AGAIN
          </button>
          <Link
            href="/collections"
            className="border border-[var(--color-primary)] text-[var(--color-primary)] text-label-caps px-6 py-4 hover:bg-[var(--color-surface-container)] transition-colors"
          >
            ALL COLLECTIONS
          </Link>
        </div>
      </div>
    </div>
  );
}

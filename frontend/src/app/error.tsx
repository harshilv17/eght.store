"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <div className="min-h-screen flex items-center justify-center px-10">
      <div className="text-center max-w-md">
        <p className="text-label-caps text-[var(--color-on-surface-variant)] mb-4">ERROR</p>
        <h1 className="text-headline-md text-[var(--color-primary)] mb-6">
          Something went wrong
        </h1>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mb-8">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-label-caps px-8 py-4 hover:opacity-80 transition-opacity"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}

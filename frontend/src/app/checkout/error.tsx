"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CheckoutError({
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
          Checkout error
        </p>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mb-8">
          {error.message || "Something went wrong during checkout. Your cart is safe — try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-label-caps px-6 py-4 hover:opacity-80 transition-opacity"
          >
            TRY AGAIN
          </button>
          <Link
            href="/"
            className="border border-[var(--color-primary)] text-[var(--color-primary)] text-label-caps px-6 py-4 hover:bg-[var(--color-surface-container)] transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
}

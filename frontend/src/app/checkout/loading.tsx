export default function CheckoutLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
      <div className="w-6 h-6 border-2 border-[var(--color-outline-variant)] border-t-[var(--color-primary)] rounded-full animate-spin" />
      <span className="sr-only">Loading checkout…</span>
    </div>
  );
}

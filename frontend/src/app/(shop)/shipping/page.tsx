import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns — EGHT",
  description: "EGHT Studios Shipping & Returns Information.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-[800px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      <h1 className="text-headline-lg text-[var(--color-primary)] mb-8 uppercase">Shipping & Returns</h1>
      <div className="prose prose-invert">
        <p className="text-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
          We offer worldwide shipping. All orders are processed within 1-2 business days. Returns are accepted within 14 days of delivery provided the garments are in original unworn condition.
        </p>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mt-4">
          More details coming soon.
        </p>
      </div>
    </div>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stores — EGHT",
  description: "EGHT Studios Store Locations.",
};

export default function StoresPage() {
  return (
    <div className="max-w-[800px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      <h1 className="text-headline-lg text-[var(--color-primary)] mb-8 uppercase">Stores</h1>
      <div className="prose prose-invert">
        <p className="text-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
          EGHT Studios flagship locations and stockists.
        </p>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mt-4">
          Currently operating exclusively online. Physical retail locations will be announced via our newsletter.
        </p>
      </div>
    </div>
  );
}

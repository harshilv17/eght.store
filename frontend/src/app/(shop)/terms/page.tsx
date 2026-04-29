import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — EGHT",
  description: "EGHT Studios Terms of Service.",
};

export default function TermsPage() {
  return (
    <div className="max-w-[800px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      <h1 className="text-headline-lg text-[var(--color-primary)] mb-8 uppercase">Terms of Service</h1>
      <div className="prose prose-invert">
        <p className="text-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
          By using our website and purchasing our products, you agree to our terms of service.
        </p>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mt-4">
          Full terms and conditions documentation will be updated here.
        </p>
      </div>
    </div>
  );
}

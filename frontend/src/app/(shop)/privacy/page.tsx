import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — EGHT",
  description: "EGHT Studios Privacy Policy.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[800px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      <h1 className="text-headline-lg text-[var(--color-primary)] mb-8 uppercase">Privacy Policy</h1>
      <div className="prose prose-invert">
        <p className="text-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
          Your privacy is important to us. This policy outlines how we collect, use, and protect your personal data across the EGHT Studios platform.
        </p>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mt-4">
          Detailed terms and conditions will be published here shortly.
        </p>
      </div>
    </div>
  );
}

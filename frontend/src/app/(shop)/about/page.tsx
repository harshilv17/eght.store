import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — EGHT",
  description: "About EGHT Studios.",
};

export default function AboutPage() {
  return (
    <div className="max-w-[800px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      <h1 className="text-headline-lg text-[var(--color-primary)] mb-8 uppercase">About Us</h1>
      <div className="prose prose-invert">
        <p className="text-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
          EGHT Studios is a premium streetwear label focused on utilitarian design, structural integrity, and monochromatic aesthetics. We build garments that serve as the uniform for the modern metropolis.
        </p>
      </div>
    </div>
  );
}

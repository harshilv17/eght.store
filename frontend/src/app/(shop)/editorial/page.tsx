import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial — EGHT",
  description: "EGHT Studios Editorial and Lookbooks.",
};

export default function EditorialPage() {
  return (
    <div className="max-w-[800px] mx-auto px-[var(--spacing-margin-edge)] py-[var(--spacing-section-gap)]">
      <h1 className="text-headline-lg text-[var(--color-primary)] mb-8 uppercase">Editorial</h1>
      <div className="prose prose-invert">
        <p className="text-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
          The EGHT Studios editorial archive. Lookbooks, campaigns, and visual stories exploring the intersection of modern minimalism and structural utility. Content coming soon.
        </p>
      </div>
    </div>
  );
}

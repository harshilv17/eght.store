import Link from "next/link";

export function ManifestoSection() {
  return (
    <section className="bg-[var(--color-primary)] text-[var(--color-on-primary)] py-[var(--spacing-section-gap)] px-[var(--spacing-margin-edge)]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-gutter)]">
        <div className="md:col-span-4 flex items-start">
          <p className="text-label-caps text-[var(--color-on-primary-container)] tracking-widest">
            MANIFESTO / 01
          </p>
        </div>

        <div className="md:col-span-8">
          <h2
            className="font-bold leading-tight tracking-tighter mb-8"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.02em", lineHeight: "110%" }}
          >
            STRUCTURAL INTEGRITY<br />OVER DECORATION.
          </h2>

          <p className="text-body-lg text-[var(--color-inverse-on-surface)] max-w-2xl mb-12">
            EGHT exists at the intersection of architectural minimalism and raw urban utility.
            We construct garments not just to be worn, but to inhabit space with intention.
            Every seam, cut, and fabric choice is a deliberate rejection of excess.
          </p>

          <Link
            href="/about"
            className="inline-block bg-transparent border border-[var(--color-on-primary)] text-[var(--color-on-primary)] text-label-caps px-8 py-4 tracking-widest hover:bg-[var(--color-on-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            READ THE MANIFESTO
          </Link>
        </div>
      </div>
    </section>
  );
}

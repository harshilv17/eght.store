import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full flex items-end pb-24 px-[var(--spacing-margin-edge)] bg-[var(--color-inverse-surface)] overflow-hidden" style={{ minHeight: 600, height: "clamp(600px, 70vh, 921px)" }}>
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80"
        alt="EGHT — The Void Collection"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center grayscale"
      />
      {/* Scrim: darken bottom for white heading + buttons, slight top tint for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-[1]" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col gap-6">
        <h1
          className="text-[var(--color-on-primary)] font-bold leading-none max-w-4xl"
          style={{ fontSize: "clamp(48px, 8.5vw, 120px)", letterSpacing: "-0.04em" }}
        >
          THE VOID<br />COLLECTION
        </h1>

        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/collections/new-arrivals"
            className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-label-caps px-8 py-4 tracking-widest hover:bg-[var(--color-surface-tint)] transition-colors"
          >
            SHOP DROP 001
          </Link>
          <Link
            href="/collections"
            className="bg-transparent border border-[var(--color-on-primary)] text-[var(--color-on-primary)] text-label-caps px-8 py-4 tracking-widest hover:bg-[var(--color-on-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
}

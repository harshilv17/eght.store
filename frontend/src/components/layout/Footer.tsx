import Link from "next/link";

const LINKS = [
  { label: "PRIVACY", href: "/privacy" },
  { label: "TERMS", href: "/terms" },
  { label: "SHIPPING", href: "/shipping" },
  { label: "STORES", href: "/stores" },
  { label: "INSTAGRAM", href: "https://instagram.com", external: true },
];

export function Footer() {
  return (
    <footer className="bg-[#F5F5F5] border-t border-[var(--color-outline-variant)] w-full mt-40">
      <div className="flex flex-col md:flex-row justify-between items-center px-10 py-20 max-w-[1440px] mx-auto gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-[var(--color-primary)] hover:opacity-80 transition-opacity"
        >
          EGHT
        </Link>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-8" aria-label="Footer navigation">
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label-caps text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] underline transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-label-caps text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] underline transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Copyright */}
        <p className="text-label-caps text-[var(--color-primary)] font-bold">
          © 2025 EGHT STUDIOS. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}

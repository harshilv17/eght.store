"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { Drawer } from "@/components/ui/Drawer";

const NAV_LINKS = [
  { label: "NEW ARRIVALS", href: "/collections/new-arrivals" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "EDITORIAL", href: "/editorial" },
  { label: "ABOUT", href: "/about" },
];

export function Navbar() {
  const { items, open } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-outline-variant)]">
        <div className="flex items-center justify-between w-full px-10 py-6 max-w-[1440px] mx-auto">
          {/* Left — desktop nav links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-label-caps text-[var(--color-on-surface)] tracking-[0.2em] hover:text-[var(--color-accent)] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[var(--color-on-surface)] hover:text-[var(--color-accent)] transition-colors"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Center — logo */}
          <Link
            href="/"
            className="text-3xl font-black tracking-tighter text-[var(--color-primary)] hover:opacity-80 transition-opacity absolute left-1/2 -translate-x-1/2"
          >
            EGHT
          </Link>

          {/* Right — icons */}
          <div className="flex items-center gap-6 ml-auto">
            <button
              className="text-[var(--color-on-surface)] hover:text-[var(--color-accent)] transition-colors"
              aria-label="Search"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </button>

            <Link
              href="/account/login"
              className="text-[var(--color-on-surface)] hover:text-[var(--color-accent)] transition-colors hidden md:block"
              aria-label="Account"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>

            <button
              onClick={open}
              className="relative text-[var(--color-on-surface)] hover:text-[var(--color-accent)] transition-colors"
              aria-label={`Cart, ${itemCount} item${itemCount !== 1 ? "s" : ""}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {itemCount > 0 && (
                <span aria-hidden="true" className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <Drawer
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        label="Navigation menu"
        side="left"
      >
        <div id="mobile-nav" className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-outline-variant)]">
            <span className="text-label-caps font-bold uppercase tracking-widest">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="flex flex-col px-6 py-8 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-headline-md font-bold tracking-tight text-[var(--color-on-surface)] hover:text-[var(--color-accent)] transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto px-6 py-6 border-t border-[var(--color-outline-variant)]">
            <Link
              href="/account/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-label-caps text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors uppercase tracking-widest"
            >
              Account
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  );
}

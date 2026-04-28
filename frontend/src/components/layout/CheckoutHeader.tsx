import Link from "next/link";

export function CheckoutHeader() {
  return (
    <header className="border-b border-[var(--color-outline-variant)] bg-white">
      <div className="flex items-center justify-between px-10 py-6 max-w-[1440px] mx-auto">
        <Link href="/" className="text-2xl font-black tracking-tighter text-[var(--color-primary)]">
          EGHT
        </Link>
        <div className="flex items-center gap-2 text-[var(--color-on-surface-variant)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="0" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-label-caps">SECURE CHECKOUT</span>
        </div>
      </div>
    </header>
  );
}

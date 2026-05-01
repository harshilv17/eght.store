"use client";

import { useEffect, useRef, useState } from "react";
import { useFxStore } from "@/store/fx.store";

function setCountryCookie(code: string) {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `country=${code}; expires=${expires}; path=/; SameSite=Lax`;
}

export function CountrySwitcher() {
  const { config, country, setCountry } = useFxStore();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!config) return null;

  const current = config.countries.find((c) => c.code === country) ?? config.countries[0];

  function handlePick(code: string) {
    if (code === country) {
      setOpen(false);
      return;
    }
    setCountryCookie(code);
    setCountry(code);
    setOpen(false);
    // Refresh server-rendered prices for new country.
    window.location.reload();
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="text-label-caps text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] flex items-center gap-1.5 uppercase tracking-widest"
      >
        <span>{current.code}</span>
        <span aria-hidden="true">·</span>
        <span>{current.currency}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Choose country"
          className="absolute right-0 bottom-full mb-2 min-w-[180px] bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] shadow-lg z-50"
        >
          {config.countries.map((c) => {
            const selected = c.code === country;
            return (
              <li key={c.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => handlePick(c.code)}
                  className={`w-full text-left px-4 py-3 text-label-caps uppercase tracking-widest hover:bg-[var(--color-surface-container)] ${selected ? "bg-[var(--color-surface-container)] text-[var(--color-primary)]" : "text-[var(--color-on-surface-variant)]"}`}
                >
                  {c.code} · {c.currency}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

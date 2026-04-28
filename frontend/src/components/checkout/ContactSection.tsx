"use client";

import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { AuthUser } from "@/store/auth.store";

interface ContactSectionProps {
  user: AuthUser | null;
  email: string;
  onChange: (email: string) => void;
  error?: string;
}

export function ContactSection({ user, email, onChange, error }: ContactSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-headline-md font-bold tracking-tight">Contact</h2>
        {!user && (
          <span className="text-body-md text-[var(--color-on-surface-variant)]">
            Have an account?{" "}
            <Link
              href="/account/login?redirectTo=/checkout"
              className="text-[var(--color-primary)] underline underline-offset-2"
            >
              Log in
            </Link>
          </span>
        )}
      </div>

      {user ? (
        <p className="text-body-md text-[var(--color-on-surface-variant)] py-3 px-4 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]">
          {user.email}
        </p>
      ) : (
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          required
          autoComplete="email"
        />
      )}
    </section>
  );
}

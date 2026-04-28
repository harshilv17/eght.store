import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-10">
      <div className="text-center">
        <p className="text-label-caps text-[var(--color-on-surface-variant)] mb-4">404</p>
        <h1 className="text-headline-lg text-[var(--color-primary)] mb-6 tracking-tight">
          PAGE NOT FOUND
        </h1>
        <p className="text-body-md text-[var(--color-on-surface-variant)] mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-label-caps px-8 py-4 hover:opacity-80 transition-opacity"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
}

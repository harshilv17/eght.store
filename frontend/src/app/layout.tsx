import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eght.studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EGHT Studios — Premium Streetwear",
    template: "%s — EGHT",
  },
  description:
    "EGHT Studios. Structural integrity over decoration. Premium streetwear crafted for the streets.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "EGHT Studios",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    site: "@eghtstudios",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-on-surface)] antialiased" suppressHydrationWarning>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

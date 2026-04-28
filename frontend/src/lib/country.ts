"use client";

const COUNTRY_COOKIE = "country";

export const SUPPORTED_COUNTRIES = [
  { code: "IN", name: "India", currency: "INR", symbol: "₹", locale: "en-IN" },
  { code: "US", name: "United States", currency: "USD", symbol: "$", locale: "en-US" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£", locale: "en-GB" },
  { code: "AE", name: "UAE", currency: "AED", symbol: "AED", locale: "en-AE" },
] as const;

export type CountryCode = (typeof SUPPORTED_COUNTRIES)[number]["code"];

export function getCurrentCountry(): CountryCode {
  if (typeof document === "undefined") return "IN";
  const match = document.cookie.match(/(?:^|; )country=([^;]*)/);
  return (match ? decodeURIComponent(match[1]) : "IN") as CountryCode;
}

export function setCountry(code: CountryCode): void {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COUNTRY_COOKIE}=${code}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getCountryMeta(code: CountryCode) {
  return SUPPORTED_COUNTRIES.find((c) => c.code === code) ?? SUPPORTED_COUNTRIES[0];
}

export function formatPrice(amount: number, countryCode: CountryCode = "IN"): string {
  const meta = getCountryMeta(countryCode);
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: meta.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

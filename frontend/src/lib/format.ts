const LOCALE_BY_CURRENCY: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  GBP: "en-GB",
  AED: "en-AE",
};

export function formatCurrency(amount: number, currency = "INR"): string {
  const locale = LOCALE_BY_CURRENCY[currency] ?? "en-IN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatOrderId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}

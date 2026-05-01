// Country / currency / shipping / tax pricing rules.
// Prices are stored canonical in INR. Display currency converted via fixed FX.
// FX rates are per 1 INR; update via cron in future.

export const COUNTRIES = {
  IN: { currency: 'INR', symbol: '₹', fxFromInr: 1, taxRate: 0.18, taxLabel: 'GST' },
  US: { currency: 'USD', symbol: '$', fxFromInr: 0.012, taxRate: 0, taxLabel: 'Tax' },
  GB: { currency: 'GBP', symbol: '£', fxFromInr: 0.0095, taxRate: 0.20, taxLabel: 'VAT' },
  AE: { currency: 'AED', symbol: 'AED', fxFromInr: 0.044, taxRate: 0.05, taxLabel: 'VAT' },
};

export const DEFAULT_COUNTRY = 'IN';

export function getCountryMeta(code) {
  return COUNTRIES[code] ?? COUNTRIES[DEFAULT_COUNTRY];
}

export function convertFromInr(amountInr, country) {
  const meta = getCountryMeta(country);
  return amountInr * meta.fxFromInr;
}

// Shipping rules:
// - IN: free standard ≥ ₹2000 subtotal, else ₹99
// - International: flat ₹2500 (~$30) base, free over ₹15000
function shippingInInr(country, subtotalInr) {
  if (country === 'IN') {
    return subtotalInr >= 2000 ? 0 : 99;
  }
  return subtotalInr >= 15000 ? 0 : 2500;
}

export function computeTotals({ subtotalInr, country }) {
  const meta = getCountryMeta(country);
  const shipInr = shippingInInr(country, subtotalInr);
  const taxableInr = subtotalInr + shipInr;
  const taxInr = Math.round(taxableInr * meta.taxRate * 100) / 100;
  const totalInr = subtotalInr + shipInr + taxInr;

  const round = (n) => Math.round(convertFromInr(n, country) * 100) / 100;

  return {
    currency: meta.currency,
    taxLabel: meta.taxLabel,
    subtotal: round(subtotalInr),
    shipping: round(shipInr),
    tax: round(taxInr),
    total: round(totalInr),
    // Canonical INR amounts retained for Razorpay charging.
    subtotalInr,
    shippingInr: shipInr,
    taxInr,
    totalInr,
  };
}

export function detectCountryFromHeaders(headers) {
  const v = headers['x-vercel-ip-country'] || headers['cf-ipcountry'] || headers['x-country-code'];
  if (typeof v === 'string' && v.length === 2 && COUNTRIES[v.toUpperCase()]) {
    return v.toUpperCase();
  }
  return DEFAULT_COUNTRY;
}

export function resolveCountry(req) {
  // Priority: explicit query > cookie > IP header > default.
  const q = req.query?.country;
  if (typeof q === 'string' && COUNTRIES[q.toUpperCase()]) return q.toUpperCase();
  const cookie = req.cookies?.country;
  if (typeof cookie === 'string' && COUNTRIES[cookie.toUpperCase()]) return cookie.toUpperCase();
  return detectCountryFromHeaders(req.headers);
}

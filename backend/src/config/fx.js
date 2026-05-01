// FX rates per 1 INR. Source: defaults below; override via FX_RATES env var as JSON.
// Schema: { "USD": 0.012, "GBP": 0.0095, "AED": 0.044 }
// Refresh strategy (future): cron job hits a free FX API and writes to env / DB.

const DEFAULT_FX = {
  INR: 1,
  USD: 0.012,
  GBP: 0.0095,
  AED: 0.044,
};

function parseEnv() {
  const raw = process.env.FX_RATES;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    return parsed;
  } catch {
    return null;
  }
}

const override = parseEnv();

export const FX_RATES = { ...DEFAULT_FX, ...(override || {}) };

export const FX_UPDATED_AT = override
  ? (process.env.FX_UPDATED_AT || new Date().toISOString())
  : '2026-05-01T00:00:00.000Z';

export function getFx(currency) {
  return FX_RATES[currency] ?? 1;
}

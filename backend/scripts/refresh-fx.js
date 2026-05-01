// FX refresh — fetches latest rates from open.er-api.com (free, no API key) with INR base.
// Usage: `node scripts/refresh-fx.js` → prints export lines ready for .env.
// Optional flag --write rewrites .env in place (FX_RATES + FX_UPDATED_AT lines).
//
// Cron: schedule daily via Vercel cron, GitHub Actions, or any scheduler:
//   0 3 * * *  cd /app/backend && node scripts/refresh-fx.js --write

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(__dirname, '..', '.env');
const TRACKED = ['USD', 'GBP', 'AED'];
const SOURCE = 'https://open.er-api.com/v6/latest/INR';

async function fetchRates() {
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`FX source returned ${res.status}`);
  const json = await res.json();
  if (json.result !== 'success') throw new Error(`FX source error: ${json['error-type'] || 'unknown'}`);

  const rates = {};
  for (const code of TRACKED) {
    const r = json.rates?.[code];
    if (typeof r !== 'number') throw new Error(`Missing rate for ${code}`);
    rates[code] = Math.round(r * 1e6) / 1e6;
  }
  return { rates, updatedAt: new Date(json.time_last_update_utc || Date.now()).toISOString() };
}

function upsertEnvVar(env, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(env)) return env.replace(re, line);
  return (env.endsWith('\n') ? env : env + '\n') + line + '\n';
}

async function main() {
  const { rates, updatedAt } = await fetchRates();
  const fxJson = JSON.stringify(rates);

  console.log(`# FX rates per 1 INR (source: ${SOURCE})`);
  console.log(`FX_RATES=${fxJson}`);
  console.log(`FX_UPDATED_AT=${updatedAt}`);

  if (process.argv.includes('--write')) {
    if (!existsSync(ENV_PATH)) throw new Error(`.env not found at ${ENV_PATH}`);
    let env = readFileSync(ENV_PATH, 'utf8');
    env = upsertEnvVar(env, 'FX_RATES', fxJson);
    env = upsertEnvVar(env, 'FX_UPDATED_AT', updatedAt);
    writeFileSync(ENV_PATH, env);
    console.log(`# wrote .env`);
  }
}

main().catch((err) => {
  console.error('FX refresh failed:', err.message);
  process.exit(1);
});

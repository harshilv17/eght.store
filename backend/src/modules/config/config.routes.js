import { Router } from 'express';
import { sendSuccess } from '../../utils/helpers.js';
import { COUNTRIES, DEFAULT_COUNTRY } from '../../utils/pricing.js';
import { FX_UPDATED_AT } from '../../config/fx.js';

const router = Router();

router.get('/fx', (_req, res) => {
  const countries = Object.entries(COUNTRIES).map(([code, meta]) => ({
    code,
    currency: meta.currency,
    symbol: meta.symbol,
    fxFromInr: meta.fxFromInr,
    taxLabel: meta.taxLabel,
    taxRate: meta.taxRate,
  }));
  sendSuccess(res, {
    defaultCountry: DEFAULT_COUNTRY,
    updatedAt: FX_UPDATED_AT,
    countries,
  });
});

export default router;

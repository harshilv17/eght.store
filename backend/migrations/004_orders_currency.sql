-- Snapshot the currency context at order creation so receipts are reproducible
-- even if FX rates or country rules change later. INR canonical fields stay
-- authoritative for payment/refund; display_* are presentation-only.

ALTER TABLE orders
  ADD COLUMN country_code VARCHAR(2) NOT NULL DEFAULT 'IN',
  ADD COLUMN display_currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  ADD COLUMN display_total NUMERIC(12, 2),
  ADD COLUMN display_breakdown JSONB;

ALTER TABLE orders
  ALTER COLUMN country_code DROP DEFAULT,
  ALTER COLUMN display_currency DROP DEFAULT;

-- [CORE] 116_ALBY_BITCOIN_PAYMENT.sql
-- Add support for Alby / WebLN Bitcoin payments

-- 1. Add Lightning Preimage to Orders (Proof of Payment)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS lightning_preimage text;

-- 2. Add Total Sats display Column (for tracking Bitcoin amount)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_sats bigint;

-- 3. Comment for tracking
COMMENT ON COLUMN public.orders.lightning_preimage IS 'Proof of payment (preimage) returned by Alby/WebLN wallet after successful transaction';
COMMENT ON COLUMN public.orders.total_sats IS 'The final amount in Satoshis paid via Bitcoin Lightning';

ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS min_spend numeric DEFAULT 0;

ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS once_per_user boolean DEFAULT false;

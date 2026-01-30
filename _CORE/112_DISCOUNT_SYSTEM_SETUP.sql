-- [CORE] 112_DISCOUNT_SYSTEM_SETUP.sql
-- Setup for Discount & Coupon System

-- 1. Add original_price to Products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price numeric;

-- 2. Create Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    code text UNIQUE NOT NULL,
    discount_type text CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
    discount_value numeric NOT NULL,
    usage_limit integer DEFAULT NULL,
    usage_count integer DEFAULT 0,
    is_active boolean DEFAULT true,
    expiry_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enhance Orders table to track discounts
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS coupon_code text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;

-- 4. Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Public can read active coupons (for validation at checkout)
DROP POLICY IF EXISTS "Public check coupons" ON public.coupons;
CREATE POLICY "Public check coupons" ON public.coupons 
FOR SELECT USING (is_active = true AND (expiry_date IS NULL OR expiry_date > now()));

-- Admin can do everything
DROP POLICY IF EXISTS "Admin full access coupons" ON public.coupons;
CREATE POLICY "Admin full access coupons" ON public.coupons 
FOR ALL USING (true) WITH CHECK (true);

-- 5. Mock Data for Testing
INSERT INTO public.coupons (code, discount_type, discount_value, usage_limit)
VALUES 
('WELCOME10', 'percentage', 10, 100),
('BITCOIN50', 'fixed', 50, 50)
ON CONFLICT (code) DO NOTHING;

-- 6. Trigger to increment usage_count on order (Optional, but good practice)
-- For now we will handle incrementing via checkout logic or a separate order function.

-- [LOYALTY] 117_MEMBERSHIP_AND_AFFILIATE.sql
-- Implements Membership Tiers and Affiliate Referral Tracking

-- 1. Add loyalty columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier text DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'rare_earth', 'bitcoin'));
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS points_non_negative;
ALTER TABLE public.profiles ADD CONSTRAINT points_non_negative CHECK (points >= 0);

-- 2. Create Affiliate Referrals table
CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    referred_order_id text REFERENCES public.orders(id) ON DELETE SET NULL,
    commission_amount numeric(12,2) DEFAULT 0,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS on affiliate_referrals
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- 4. Policies for affiliate_referrals
DROP POLICY IF EXISTS "Users can view their own referrals" ON public.affiliate_referrals;
CREATE POLICY "Users can view their own referrals" 
    ON public.affiliate_referrals FOR SELECT 
    USING (auth.uid() = referrer_id);

-- 5. Trigger to automatically award points and handle referrals on order payment
-- Note: This is a simplified logic, real production might use a webhook or more complex trigger
CREATE OR REPLACE FUNCTION public.handle_loyalty_on_payment()
RETURNS TRIGGER AS $$
DECLARE
    order_user_id uuid;
    order_total numeric;
    referrer_id_val uuid;
    commission_val numeric;
    user_tier text;
    point_multiplier numeric := 1.0;
BEGIN
    -- Only act when payment_status changes to 'paid'
    IF (NEW.payment_status = 'paid' AND OLD.payment_status != 'paid') THEN
        order_user_id := NEW.user_id;
        order_total := NEW.total_price;

        -- A. Award Points to Buyer (1 THB = 1 Point + Tier Cashback)
        SELECT tier INTO user_tier FROM public.profiles WHERE id = order_user_id;
        
        point_multiplier := CASE 
            WHEN user_tier = 'bitcoin' THEN 1.21
            WHEN user_tier = 'rare_earth' THEN 1.10
            WHEN user_tier = 'platinum' THEN 1.07
            WHEN user_tier = 'gold' THEN 1.05
            WHEN user_tier = 'silver' THEN 1.02
            ELSE 1.0
        END;

        UPDATE public.profiles 
        SET points = points + floor(order_total * point_multiplier)
        WHERE id = order_user_id;

        -- B. Update Tier based on points
        UPDATE public.profiles
        SET tier = CASE 
            WHEN points >= 2100000 THEN 'bitcoin'
            WHEN points >= 500000 THEN 'rare_earth'
            WHEN points >= 210000 THEN 'platinum'
            WHEN points >= 50000 THEN 'gold'
            WHEN points >= 10000 THEN 'silver'
            ELSE 'bronze'
        END
        WHERE id = order_user_id;

        -- C. Handle Affiliate Commission (Tier-based & Points for Referrer)
        IF (NEW.meta->>'ref' IS NOT NULL) THEN
            referrer_id_val := (NEW.meta->>'ref')::uuid;
            
            -- Prevent self-referral
            IF (referrer_id_val != order_user_id) THEN
                -- 1. Get Referrer Tier
                SELECT tier INTO user_tier FROM public.profiles WHERE id = referrer_id_val;

                -- 2. Calculate Commission % based on Referrer's Tier
                -- Max 20% for Bitcoin Tier
                commission_val := order_total * CASE 
                    WHEN user_tier = 'bitcoin' THEN 0.20  -- 20%
                    WHEN user_tier = 'rare_earth' THEN 0.15 -- 15%
                    WHEN user_tier = 'platinum' THEN 0.10  -- 10%
                    WHEN user_tier = 'gold' THEN 0.07      -- 7%
                    WHEN user_tier = 'silver' THEN 0.05    -- 5%
                    ELSE 0.03                              -- 3%
                END;
                
                -- 3. Record Commission
                INSERT INTO public.affiliate_referrals (referrer_id, referred_order_id, commission_amount, status)
                VALUES (referrer_id_val, NEW.id, commission_val, 'pending');

                -- 4. [Bonus] Give Points to Referrer too (50% of order value as points)
                UPDATE public.profiles 
                SET points = points + floor(order_total * 0.5)
                WHERE id = referrer_id_val;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach trigger to orders table
DROP TRIGGER IF EXISTS tr_loyalty_on_payment ON public.orders;
CREATE TRIGGER tr_loyalty_on_payment
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_loyalty_on_payment();

-- 7. Security: Atomic Point Deduction & Validation
-- Ensures points are deducted during order insertion and cannot exceed balance
CREATE OR REPLACE FUNCTION public.validate_order_security()
RETURNS TRIGGER AS $$
DECLARE
    user_pts integer;
    pts_to_use integer;
BEGIN
    -- 1. Enforce non-negative total_price at insertion
    IF (NEW.total_price < 0) THEN
        RAISE EXCEPTION 'Order total cannot be negative';
    END IF;

    -- 2. Atomic Point Deduction
    IF (NEW.user_id IS NOT NULL) THEN
        pts_to_use := COALESCE((NEW.meta->>'points_used')::integer, 0);
        
        IF (pts_to_use > 0) THEN
            -- Get fresh points balance
            SELECT points INTO user_pts FROM public.profiles WHERE id = NEW.user_id;
            
            IF (user_pts < pts_to_use) THEN
                RAISE EXCEPTION 'Insufficient loyalty points (Available: %, Requested: %)', user_pts, pts_to_use;
            END IF;
            
            -- Deduct points atomically
            UPDATE public.profiles SET points = points - pts_to_use WHERE id = NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_validate_order_security ON public.orders;
CREATE TRIGGER tr_validate_order_security
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_order_security();

-- [CORE] 62_FIX_ORDERS_META_COLUMN.sql
-- Fixes the error: record "new" has no field "meta" by adding the missing column to the orders table

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::JSONB;

-- Ensure the trigger function handle_loyalty_on_payment can safe-handle null or missing meta
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
    IF (NEW.payment_status = 'paid' AND COALESCE(OLD.payment_status, '') != 'paid') THEN
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
        -- Safe check for meta field
        IF (NEW.meta IS NOT NULL AND NEW.meta->>'ref' IS NOT NULL) THEN
            BEGIN
                referrer_id_val := (NEW.meta->>'ref')::uuid;
                
                -- Prevent self-referral
                IF (referrer_id_val != order_user_id) THEN
                    -- 1. Get Referrer Tier
                    SELECT tier INTO user_tier FROM public.profiles WHERE id = referrer_id_val;

                    -- 2. Calculate Commission % based on Referrer's Tier
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
            EXCEPTION WHEN OTHERS THEN
                -- If ref is not a valid UUID, just ignore
                NULL;
            END;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

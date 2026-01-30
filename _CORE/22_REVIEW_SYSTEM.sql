-- [CORE] 22_REVIEW_SYSTEM.sql
-- Implements Order Reviews and Auto-Confirmation Logic

-- 1. Create REVIEWS Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id text REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id text REFERENCES public.products(id) ON DELETE CASCADE,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    comment text,
    is_auto_generated boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(order_id, product_id) -- One review per product per order
);

-- Enable RLS for Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. Update ORDERS Table (Lifecycle Columns)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipped_at timestamp with time zone;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS received_at timestamp with time zone;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS dispute_reason text;

-- 3. Automation Logic Function
-- This function checks for eligible orders and auto-updates them.
-- Logic:
--   a) Auto-Confirm: If shipped > 7 days ago -> Set Delivered
--   b) Auto-Review: If delivered > 5 days ago AND no review -> Set 5 stars
CREATE OR REPLACE FUNCTION public.check_order_automations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r_order RECORD;
    r_item RECORD;
BEGIN
    -- A. Auto-Confirm Orders (Shipped -> Delivered after 7 days)
    UPDATE public.orders
    SET 
        shipping_status = 'delivered',
        received_at = now()
    WHERE 
        shipping_status = 'shipped' 
        AND shipped_at < (now() - interval '7 days');

    -- B. Auto-Review Orders (Delivered > 5 days ago AND No Review)
    FOR r_order IN 
        SELECT * FROM public.orders 
        WHERE shipping_status = 'delivered' 
        AND received_at < (now() - interval '5 days')
    LOOP
        -- Loop through items in this order
        FOR r_item IN SELECT * FROM public.order_items WHERE order_id = r_order.id LOOP
            -- Check if review already exists
            IF NOT EXISTS (SELECT 1 FROM public.reviews WHERE order_id = r_order.id AND product_id = r_item.product_id) THEN
                -- Insert Auto 5-Star Review
                INSERT INTO public.reviews (user_id, order_id, product_id, rating, comment, is_auto_generated)
                VALUES (
                    r_order.user_id,
                    r_order.id,
                    r_item.product_id,
                    5,
                    'Auto-generated positive review (No feedback provided within 5 days).',
                    true
                );
            END IF;
        END LOOP;
    END LOOP;
END;
$$;

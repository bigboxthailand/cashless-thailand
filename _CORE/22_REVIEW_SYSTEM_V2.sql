-- [CORE] 22_REVIEW_SYSTEM.sql (Enhanced)
-- Implements Order Reviews and Auto-Confirmation Logic

-- 3. Automation Logic Function
CREATE OR REPLACE FUNCTION public.check_order_automations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r_order RECORD;
    r_item RECORD;
    -- Array of 10 neutral/positive comments
    comments text[] := ARRAY[
        'ได้รับสินค้าแล้วครับ ขอบคุณครับ',
        'Good quality product.',
        'จัดส่งรวดเร็ว สินค้าครบถ้วน',
        'สินค้าตรงปก ใช้งานได้ดี',
        'Recommended! Will buy again.',
        'บริการดีมากครับ ประทับใจ',
        'ได้รับของเรียบร้อย แพ็คมาดีครับ',
        'คุ้มค่าราคาครับ',
        'Fast delivery and good service.',
        'สินค้าดูดีมีคุณภาพครับ'
    ];
    random_comment text;
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
                
                -- Select Random Comment
                random_comment := comments[floor(random() * 10 + 1)];

                -- Insert Auto 5-Star Review
                INSERT INTO public.reviews (user_id, order_id, product_id, rating, comment, is_auto_generated)
                VALUES (
                    r_order.user_id,
                    r_order.id,
                    r_item.product_id,
                    5,
                    random_comment,
                    true
                );
            END IF;
        END LOOP;
    END LOOP;
END;
$$;

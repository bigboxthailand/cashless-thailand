-- [CORE] 07_GENERATE_MIXED_ORDER.sql
-- สร้าง Order ตัวอย่างที่มีสินค้าหลายชิ้น (คละกัน) เพื่อทดสอบการแสดงผล Admin

DO $$
DECLARE
    -- สร้าง ID สุ่ม: ORD-MIXED-XXX
    new_order_id TEXT := 'ORD-MIXED-' || floor(random() * 1000)::text;
    r_profile RECORD;
BEGIN
    -- 1. ดึง User มาสักคนเพื่อผูกข้อมูล
    SELECT * INTO r_profile FROM public.profiles LIMIT 1;

    -- 2. Insert Orders Table (Header)
    INSERT INTO public.orders (
        id, 
        user_id, 
        customer_name, 
        customer_email, 
        customer_phone,
        shipping_address, 
        province, 
        zipcode,
        total_price, 
        payment_method, 
        payment_status, 
        shipping_status,
        slip_image,
        created_at
    ) VALUES (
        new_order_id, 
        r_profile.id,
        'Mr. Mixed Order (Test)', 
        'test_mixed@example.com', 
        '081-999-8888',
        '888 Test Village, Mixed Road', 
        'Bangkok', 
        '10110',
        3800, -- Total Price (2500 + 900 + 400)
        'PromptPay', 
        'paid', 
        'pending',
        'https://placehold.co/400x600/png?text=Slip+Test',
        now()
    );

    -- 3. Insert Order Items (Detail) - 3 Items คล่ะกัน
    
    -- Item 1: Hardware Wallet (1 ชิ้น)
    INSERT INTO public.order_items (order_id, title, price, quantity, image_url)
    VALUES (new_order_id, 'Hardware Wallet Pro', 2500, 1, 'https://placehold.co/200/black/gold?text=Wallet');

    -- Item 2: T-Shirt (2 ตัว)
    INSERT INTO public.order_items (order_id, title, price, quantity, image_url)
    VALUES (new_order_id, 'Bitcoin T-Shirt', 450, 2, 'https://placehold.co/200/orange/white?text=Shirt');

    -- Item 3: Sticker (1 แพ็ค)
    INSERT INTO public.order_items (order_id, title, price, quantity, image_url)
    VALUES (new_order_id, 'Crypto Stickers', 400, 1, 'https://placehold.co/200/green/white?text=Stickers');

END $$;

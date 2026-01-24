-- [CORE] 04_GENERATE_ORDERS.sql
-- ล้าง Order เก่าทิ้งทั้งหมด และสร้าง Order ใหม่โดยอิงข้อมูลจริงจาก Profiles, Addresses และ Products (JSONB Supported)

-- 1. [CLEANUP] ล้างข้อมูลเก่า & ปลดล็อค FK Constraints & แก้ไข Schema
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS variant_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS sex text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS buy_duration integer;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS province text;

TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;

-- 2. [GENERATE] สร้าง Order ใหม่ 80 รายการ (เพิ่มจำนวนหน่อย)
DO $$
DECLARE
    i INT;
    r_profile RECORD;
    r_product RECORD;
    r_address RECORD;
    
    -- Variables for extracting JSONB data
    p_title TEXT;
    p_price NUMERIC;
    p_image TEXT;
    
    gen_order_id TEXT;
    gen_variant TEXT;
    gen_qty INT;
    gen_price NUMERIC;
    gen_total NUMERIC;
    gen_status TEXT;
    gen_created TIMESTAMP;
BEGIN
    FOR i IN 1..80 LOOP
        
        -- 2.1 สุ่ม User (ที่มี Address)
        SELECT * INTO r_profile FROM public.profiles ORDER BY random() LIMIT 1;
        SELECT * INTO r_address FROM public.addresses WHERE user_id = r_profile.id LIMIT 1;
        
        IF r_address IS NULL THEN CONTINUE; END IF;

        -- 2.2 สุ่ม สินค้า (Product)
        SELECT * INTO r_product FROM public.products ORDER BY random() LIMIT 1;

        -- EXTRACT DATA FROM JSONB (รองรับ Schema จริงของ User)
        -- ใช้ COALESCE ป้องกัน Null (เผื่อมีคอลัมน์จริงหรือไม่มีก็ได้)
        -- แต่หลักๆ จะดึงจาก JSONB
        
        -- Title
        BEGIN
            p_title := r_product.meta->>'title';
        EXCEPTION WHEN OTHERS THEN
            p_title := 'Unknown Product'; -- Fallback
        END;

        -- Price
        BEGIN
            p_price := (r_product.pricing->>'basePrice')::numeric;
        EXCEPTION WHEN OTHERS THEN
            p_price := 0;
        END;

        -- Image
        BEGIN
            p_image := r_product.media->>'mainImage';
        EXCEPTION WHEN OTHERS THEN
            p_image := 'https://placehold.co/100';
        END;


        -- 2.3 สุ่ม Variant จาก JSON config (ถ้ามี)
        IF r_product.config IS NOT NULL AND jsonb_array_length(r_product.config->'variants') > 0 THEN
            SELECT value->>'name', (value->>'price')::numeric 
            INTO gen_variant, gen_price
            FROM jsonb_array_elements(r_product.config->'variants') 
            ORDER BY random() LIMIT 1;
        ELSE
            gen_variant := NULL;
            gen_price := p_price; -- Use Base Price
        END IF;
        
        -- Fallback price safety
        IF gen_price IS NULL THEN gen_price := 1000; END IF;


        -- 2.4 สร้าง Order Data
        gen_order_id := 'ORD-' || to_char(now(), 'YYYY') || '-' || lpad(i::text, 4, '0');
        gen_qty := floor(random() * 3 + 1); -- 1-3 ชิ้น
        gen_total := gen_price * gen_qty;
        
        -- สุ่มสถานะ
        IF random() < 0.1 THEN gen_status := 'shipped';
        ELSIF random() < 0.8 THEN gen_status := 'paid';
        ELSE gen_status := 'pending';
        END IF;
        
        gen_created := now() - (random() * interval '60 days');

        -- 2.5 INSERT ORDER
        INSERT INTO public.orders (
            id, user_id, 
            customer_name, customer_email, customer_phone,
            shipping_address, province, zipcode,
            total_price, payment_method, payment_status, shipping_status,
            slip_image, slip_name,
            sex, age, buy_duration,
            customer_avatar, -- [NEW] Avatar URL from Profile
            created_at
        )
        VALUES (
            gen_order_id, r_profile.id,
            r_profile.full_name, r_profile.email, r_address.phone,
            r_address.address_line1 || ' ' || r_address.district, r_address.province, r_address.zipcode,
            gen_total, 'PromptPay', gen_status, gen_status,
            '/payment_slip.png', 'slip.png',
            r_profile.sex, r_profile.age, floor(random()*600 + 30),
            r_profile.avatar_url, -- [NEW] Value
            gen_created
        );

        -- 2.6 INSERT ORDER ITEM
        INSERT INTO public.order_items (
            order_id, product_id, title,
            price, quantity, image_url,
            variant_name
        )
        VALUES (
            gen_order_id, r_product.id, p_title,
            gen_price, gen_qty, p_image,
            gen_variant
        );

    END LOOP;
END $$;

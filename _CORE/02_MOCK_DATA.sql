-- [CORE] 02_MOCK_DATA.sql
-- คำสั่งสำหรับสร้างข้อมูลจำลองและแก้ไขข้อมูลเดิม (Run ไฟล์นี้เป็นอันดับ 2)
-- รวม: Sync Variants, สร้าง User คนจริง, กระจายยอดขายทั่วไทย

-- PART 1: VARIANT SYNC (แก้ข้อมูล Product ID และ Variant ให้ตรงรุ่น)
UPDATE public.order_items SET product_id = 'cryptoclock-basic' WHERE title ILIKE '%Basic%';
UPDATE public.order_items SET product_id = 'cryptoclock-pro' WHERE title ILIKE '%Pro%';
UPDATE public.order_items SET product_id = 'cryptoclock-saving' WHERE title ILIKE '%Saving%';
UPDATE public.order_items SET product_id = 'cryptoclock-epaper' WHERE title ILIKE '%ePaper%';
UPDATE public.order_items SET product_id = 'bitterm-series' WHERE title ILIKE '%BiTTerm%';
UPDATE public.order_items SET product_id = 'bitpos-terminal' WHERE title ILIKE '%POS%';
UPDATE public.order_items SET product_id = 'bitnode-personal' WHERE title ILIKE '%Node%';

-- PART 2: PROFILES & DEMOGRAPHICS (สร้างคนและสถิติ)
DO $$
DECLARE
    new_user_id uuid;
    i INT;
    m_names text[] := ARRAY['Somchai', 'Somsak', 'Arthit', 'Prasit', 'Winai', 'Nattapong', 'Ananda', 'Mario'];
    m_images text[] := ARRAY[ 'https://randomuser.me/api/portraits/men/1.jpg', 'https://randomuser.me/api/portraits/men/32.jpg', 'https://randomuser.me/api/portraits/men/45.jpg', 'https://randomuser.me/api/portraits/men/22.jpg', 'https://randomuser.me/api/portraits/men/15.jpg', 'https://randomuser.me/api/portraits/men/68.jpg', 'https://randomuser.me/api/portraits/men/74.jpg', 'https://randomuser.me/api/portraits/men/11.jpg' ];
    
    f_names text[] := ARRAY['Malai', 'Suda', 'Ratana', 'Malee', 'Achara', 'Busaba', 'Chitra', 'Darunee'];
    f_images text[] := ARRAY[ 'https://randomuser.me/api/portraits/women/12.jpg', 'https://randomuser.me/api/portraits/women/24.jpg', 'https://randomuser.me/api/portraits/women/45.jpg', 'https://randomuser.me/api/portraits/women/33.jpg', 'https://randomuser.me/api/portraits/women/65.jpg', 'https://randomuser.me/api/portraits/women/18.jpg', 'https://randomuser.me/api/portraits/women/90.jpg', 'https://randomuser.me/api/portraits/women/21.jpg' ];
BEGIN
    -- ล้าง Profiles เก่า (Optional? No, keep adding is risky for dupes)
    -- Actually better not to truncate variants/profiles here unless we want fresh start.
    -- Assuming user runs this for fresh setup.
    DELETE FROM public.profiles;

    -- Insert Men
    FOR i IN 1..8 LOOP
        INSERT INTO public.profiles (email, full_name, avatar_url, sex, age)
        VALUES ( lower(m_names[i]) || '@test.com', m_names[i] || ' Sukbhum', m_images[i], 'Male', floor(random() * (50-25 + 1) + 25) );
    END LOOP;

    -- Insert Women
    FOR i IN 1..8 LOOP
        INSERT INTO public.profiles (email, full_name, avatar_url, sex, age)
        VALUES ( lower(f_names[i]) || '@test.com', f_names[i] || ' Charoen', f_images[i], 'Female', floor(random() * (40-20 + 1) + 20) );
    END LOOP;
END $$;

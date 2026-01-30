-- [CORE] 01_SCHEMA_SETUP.sql
-- คำสั่งหลักสำหรับการสร้างโครงสร้าง Database ทั้งหมด (Run ไฟล์นี้เป็นอันดับ 1)
-- รวม: Products, Profiles, Store Settings, และการแก้สิทธิ์ (Policies)

-- 1. [CLEANUP] ลบของเก่าที่อาจมีปัญหา
DROP POLICY IF EXISTS "Enable read access for all" ON public.orders;
DROP POLICY IF EXISTS "Allow logged-in update" ON public.orders;
DROP POLICY IF EXISTS "Enable update for logged-in users" ON public.orders;
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow all insert products" ON public.products;
DROP POLICY IF EXISTS "Allow all update products" ON public.products;

-- 2. PRODUCTS TABLE (สินค้า)
CREATE TABLE IF NOT EXISTS public.products (
    id text PRIMARY KEY,
    title text,  -- Note: Actual data uses JSONB, but keeping mixed schema is safe
    price numeric,
    category text,
    image_url text,
    stock integer DEFAULT 100,
    meta jsonb,    -- รองรับ Data แบบ JSON
    pricing jsonb, -- รองรับ Price แบบ JSON
    media jsonb,   -- รองรับ Image แบบ JSON
    config jsonb,  -- รองรับ Variants
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PROFILES TABLE (ผู้ใช้งานจำลอง)
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email text,
    full_name text,
    avatar_url text,
    sex text,
    age integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. STORE SETTINGS (ตั้งค่าร้านค้า Admin Manager)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  store_name text DEFAULT 'Cashless Thailand',
  currency text DEFAULT 'THB',
  tax_rate numeric DEFAULT 7.0,
  maintenance_mode boolean DEFAULT false,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
INSERT INTO public.store_settings (id, store_name, currency) VALUES (1, 'Cashless Thailand', 'THB') ON CONFLICT (id) DO NOTHING;

-- 5. ORDERS ENHANCEMENT (เพิ่ม Columns สำหรับ Analytics)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS sex text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS buy_duration integer;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS province text;
-- [NEW] เพิ่ม Avatar เพื่อแสดงรูปใน Order Modal ได้ชัวร์ๆ
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_avatar text;

-- 6. ORDER ITEMS ENHANCEMENT (รองรับ Variant)
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS variant_name text;

-- 7. POLICIES (ระบบสิทธิ์)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Orders Policies
DROP POLICY IF EXISTS "Enable read access for all" ON public.orders;
CREATE POLICY "Enable read access for all" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable update for logged-in users" ON public.orders;
DROP POLICY IF EXISTS "Enable update for all users" ON public.orders;
CREATE POLICY "Enable update for all users" ON public.orders FOR UPDATE USING (true);

-- Products Policies
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all insert products" ON public.products;
CREATE POLICY "Allow all insert products" ON public.products FOR INSERT WITH CHECK (true);

-- Profiles Policies
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);

-- Store Settings Policies
DROP POLICY IF EXISTS "Allow read settings" ON public.store_settings;
CREATE POLICY "Allow read settings" ON public.store_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update settings" ON public.store_settings;
CREATE POLICY "Allow update settings" ON public.store_settings FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow insert settings" ON public.store_settings;
CREATE POLICY "Allow insert settings" ON public.store_settings FOR INSERT WITH CHECK (true);

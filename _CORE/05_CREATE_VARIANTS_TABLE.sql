-- [CORE] 05_CREATE_VARIANTS_TABLE.sql
-- สร้างตาราง product_variants เพื่อรองรับระบบ Shopee-style (SKU/Stock/Price แยกย่อย)

-- 1. สร้างตาราง VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id text REFERENCES public.products(id) ON DELETE CASCADE, -- ID ของตาราง products เป็น TEXT
    variant_name text NOT NULL, -- ชื่อตัวเลือก เช่น "White", "Size S"
    sku text,                   -- รหัสสินค้าเฉพาะตัวเลือกนี้
    stock integer DEFAULT 0,    -- สต็อกแยก
    price numeric DEFAULT 0,    -- ราคาแยก
    image_url text,             -- รูปเฉพาะตัวเลือก (เช่น สีแดงก็โชว์รูปสีแดง)
    options jsonb DEFAULT '{}'::jsonb, -- เก็บข้อมูลเสริม เช่น { "color_code": "#F0F0F0" }
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. สร้าง Index เพื่อความเร็ว
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

-- 3. เปิดสิทธิ์ (RLS) ให้ Admin ใช้งานได้
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read variants" ON public.product_variants;
CREATE POLICY "Public read variants" ON public.product_variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all insert variants" ON public.product_variants;
CREATE POLICY "Allow all insert variants" ON public.product_variants FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all update variants" ON public.product_variants;
CREATE POLICY "Allow all update variants" ON public.product_variants FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow all delete variants" ON public.product_variants;
CREATE POLICY "Allow all delete variants" ON public.product_variants FOR DELETE USING (true);

-- 4. [OPTIONAL] ตัวอย่างคำสั่ง Migrate Data (Run manual if needed)
-- INSERT INTO public.product_variants (product_id, variant_name, price, stock, options)
-- VALUES 
-- ('cryptoclock-basic', 'White', 980, 50, '{"color": "#F0F0F0"}'),
-- ('cryptoclock-basic', 'Black', 980, 50, '{"color": "#111111"}');

-- [CORE] 03_GENERATE_ADDRESSES.sql
-- คำสั่งสร้างตารางที่อยู่และสุ่มที่อยู่ให้ User ทุกคน (คนละ 1 อัน)
-- เน้น กทม. 70% ตามที่ขอ

-- 1. [CLEANUP] ลบตารางเก่าทิ้ง เพื่อแก้ปัญหา Column ไม่ครบ (full_name etc.)
DROP TABLE IF EXISTS public.addresses CASCADE;

-- 2. สร้างตารางใหม่ (New Schema)
CREATE TABLE public.addresses (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name text,
    phone text,
    address_line1 text,
    district text,
    province text,
    zipcode text,
    is_default boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- เปิด RLS และอนุญาตให้อ่านได้
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read addresses" ON public.addresses FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON public.addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON public.addresses FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON public.addresses FOR DELETE USING (true);

-- 3. Script สร้างข้อมูลที่อยู่
DO $$
DECLARE
    r RECORD;
    is_bkk BOOLEAN;
    prov TEXT;
    dist TEXT;
    zip TEXT;
BEGIN
    -- วนลูป User ทุกคนในระบบ
    FOR r IN SELECT * FROM public.profiles LOOP
        
        -- สุ่มว่าจะเป็น กทม. หรือไม่ (70%)
        is_bkk := (random() < 0.7);
        
        IF is_bkk THEN
            prov := 'Bangkok';
            dist := (ARRAY['Sathorn', 'Bang Rak', 'Sukhumvit', 'Silom', 'Chatuchak', 'Ladprao'])[floor(random()*6)+1];
            zip := '10' || floor(random()*(50-10+1)+10)::text || '0'; -- 10xxx
        ELSE
            -- จังหวัดอื่นๆ (30%)
            prov := (ARRAY['Chiang Mai', 'Phuket', 'Khon Kaen', 'Chon Buri', 'Ayutthaya'])[floor(random()*5)+1];
            IF prov = 'Chiang Mai' THEN dist := 'Mueang'; zip := '50000';
            ELSIF prov = 'Phuket' THEN dist := 'Patong'; zip := '83000';
            ELSIF prov = 'Khon Kaen' THEN dist := 'Mueang'; zip := '40000';
            ELSIF prov = 'Chon Buri' THEN dist := 'Pattaya'; zip := '20150';
            ELSE dist := 'City Center'; zip := '13000';
            END IF;
        END IF;

        -- สร้างที่อยู่ใหม่
        INSERT INTO public.addresses (
            user_id, 
            full_name, 
            phone, 
            address_line1, 
            district, 
            province, 
            zipcode
        )
        VALUES (
            r.id,
            r.full_name,
            '08' || floor(random()*(99999999-11111111+1)+11111111)::text,
            floor(random()*(999-1+1)+1)::text || ' Moo ' || floor(random()*(10-1+1)+1)::text || ' Some Road',
            dist,
            prov,
            zip
        );
        
    END LOOP;
END $$;

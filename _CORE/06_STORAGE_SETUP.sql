-- [CORE] 06_STORAGE_SETUP.sql
-- คำสั่งสำหรับสร้าง Storage Bucket และกำหนด Policy สำหรับอัพโหลดรูปภาพ

-- 1. สร้าง Bucket ชื่อ 'products' (ถ้ายังไม่มี)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. กำหนด Policy ให้ 'ทุกคน' ดูรูปได้ (Public Read)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- 3. กำหนด Policy ให้ 'Admin' (Authenticated) อัพโหลดรูปได้
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);

-- 4. กำหนด Policy ให้ 'Admin' ลบ/แก้ไขรูปได้
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'products' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'products' AND auth.role() = 'authenticated' );

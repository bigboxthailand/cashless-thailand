-- [CORE] 100_ALLOW_PUBLIC_UPLOAD.sql
-- FIX: Wallet users are 'anon', so RLS blocks 'authenticated' policy.
-- This script allows ANYONE (public) to upload to 'products' bucket.

-- 1. Ensure bucket is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('products', 'products', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "products_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "products_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "products_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "products_delete_policy" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Insert" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Full Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read All" ON storage.objects;
DROP POLICY IF EXISTS "Allow All" ON storage.objects;

-- 3. Create TRULY PUBLIC Policy (Anon + Authenticated)

-- Allow everyone to SELECT (View)
CREATE POLICY "Public Read All"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- Allow everyone (including Wallet users who are 'anon') to INSERT (Upload)
CREATE POLICY "Public Insert All"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'products' );

-- Allow everyone to UPDATE/DELETE (This is risky but "opens it all up" as requested)
CREATE POLICY "Public Modify All"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'products' );

CREATE POLICY "Public Delete All"
ON storage.objects FOR DELETE
USING ( bucket_id = 'products' );

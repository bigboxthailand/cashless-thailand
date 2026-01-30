-- FIX STORAGE RLS FOR PRODUCTS BUCKET
-- This script drops existing policies and re-creates them to strictly allow authenticated uploads

-- 1. Ensure Bucket Exists and is Public
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop potential conflicting policies (handle various naming conventions)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects;
DROP POLICY IF EXISTS "Allow All" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Insert" ON storage.objects;

-- 3. Create Permissive Policies for Authenticated Users
-- Allow SELECT for everyone (Public Read)
CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- Allow INSERT for Authenticated Users (Any path in 'products' bucket)
CREATE POLICY "Authenticated Insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);

-- Allow UPDATE for Authenticated Users (Own files ideally, but for now authenticated is enough for shops)
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'products' AND auth.role() = 'authenticated' );

-- Allow DELETE for Authenticated Users
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'products' AND auth.role() = 'authenticated' );

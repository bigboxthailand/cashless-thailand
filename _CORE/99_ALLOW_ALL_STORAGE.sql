-- [CORE] 99_ALLOW_ALL_STORAGE.sql
-- This script opens up the 'products' bucket permissions to avoid "violates row-level security policy" errors.
-- It is designed to be run ONCE to fix all upload issues.

-- 1. Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('products', 'products', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. DANGER ZONE: Drop ALL existing restrictive policies to start fresh
DROP POLICY IF EXISTS "products_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "products_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "products_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "products_delete_policy" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects; -- Drop common default names
DROP POLICY IF EXISTS "Allow All" ON storage.objects;

-- 3. Create BROAD Permissions

-- A. Allow EVERYONE to VIEW images (Public Read)
CREATE POLICY "Public Read All"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- B. Allow ANY AUTHENTICATED USER to UPLOAD/UPDATE/DELETE
-- This "opens it all up" for logged-in users.
-- We do NOT restrict by folder path or user ID here to prevents blocks.
CREATE POLICY "Authenticated Full Access"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'products' )
WITH CHECK ( bucket_id = 'products' );

-- Note: We generally do NOT allow 'anon' (unauthenticated) uploads to prevent spam/abuse.
-- If you absolutely need anonymous uploads, you would change 'TO authenticated' to 'TO public'.
-- But 'authenticated' is usually what is meant by "users can upload".

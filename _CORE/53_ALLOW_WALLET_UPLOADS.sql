-- Update RLS policies for 'shops' bucket to allow Wallet Users (anon/public) to upload

-- 1. Allow Public INSERT (Upload)
-- Necessary because Wallet users are not authenticated via Supabase Auth, so they appear as 'anon' role.
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;

CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'shops' );

-- 2. Allow Public UPDATE (in case of overwrites, though usually we create new files)
DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'shops' );

-- 3. Allow Public SELECT (View) - Already handled but ensuring it's comprehensive
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'shops' );

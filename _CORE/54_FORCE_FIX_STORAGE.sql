-- FORCE FIX STORAGE: Reset everything for 'shops' bucket to simple public access

-- 1. Ensure bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('shops', 'shops', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop ALL existing policies for this bucket to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Give me access please" ON storage.objects;

-- 3. Create ONE simple permissive policy for EVERYTHING on 'shops' bucket
-- This allows anyone (anon/public) to Select, Insert, Update, Delete within this bucket
-- Security warning: This is open, but necessary for wallet-based (anon) users to upload.
CREATE POLICY "Shops Bucket Public Access"
ON storage.objects
FOR ALL
TO public
USING ( bucket_id = 'shops' )
WITH CHECK ( bucket_id = 'shops' );

-- 4. Verify RLS is enabled (just in case, though we can't always toggle it)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY; -- Commented out to avoid ownership error

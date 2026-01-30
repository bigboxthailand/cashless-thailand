-- Create 'shops' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('shops', 'shops', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Commented out as this requires table ownership and is usually already enabled)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access (Images are public)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'shops' );

-- 2. Authenticated Upload (Allow any logged-in user to upload to shops bucket)
-- Ideally we check ownership, but for now allowing auth users is sufficient to unblock
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'shops' );

-- 3. Owner Update/Delete (Allow users to update/delete their own files)
-- We assume the user created the file (owner matches auth.uid())
DROP POLICY IF EXISTS "Owner Update" ON storage.objects;
CREATE POLICY "Owner Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'shops' AND (auth.uid() = owner) );

DROP POLICY IF EXISTS "Owner Delete" ON storage.objects;
CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'shops' AND (auth.uid() = owner) );

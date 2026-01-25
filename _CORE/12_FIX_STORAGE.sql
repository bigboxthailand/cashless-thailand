-- 1. Create Bucket "chat-attachments" if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on objects (just in case, usually enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies for this bucket to ensure clean slate
DROP POLICY IF EXISTS "Public Read chat-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload chat-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files chat-attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files chat-attachments" ON storage.objects;

-- 4. Create Policies

-- Allow ANYONE to view images (Public bucket)
CREATE POLICY "Public Read chat-attachments"
ON storage.objects FOR SELECT
USING ( bucket_id = 'chat-attachments' );

-- Allow Authenticated Users to Upload
CREATE POLICY "Authenticated Upload chat-attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'chat-attachments' );

-- Allow Users to Update/Delete their own files
CREATE POLICY "Users can update own files chat-attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'chat-attachments' AND owner = auth.uid() );

CREATE POLICY "Users can delete own files chat-attachments"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'chat-attachments' AND owner = auth.uid() );

-- 1. Add new columns to messages table
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 2. Create Storage Bucket for Chat Attachments
-- Note: 'storage' schema is standard in Supabase
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies
-- Allow anyone to read chat attachments (public)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'chat-attachments' );

-- Allow authenticated users to upload
CREATE POLICY "Auth Users Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'chat-attachments' AND auth.role() = 'authenticated' );

-- Allow users to update/delete their own files (Optional, simplified)
CREATE POLICY "Auth Users Update Own" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'chat-attachments' AND auth.uid() = owner );

-- 1. Add columns to messages table for attachments
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS order_id text,
ADD COLUMN IF NOT EXISTS type text DEFAULT 'text', -- text, image, order
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- 2. Create Storage Bucket for Chat Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-images', 'chat-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies (Allow authenticated users to upload)
CREATE POLICY "Authenticated users can upload chat images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-images');

CREATE POLICY "Public can view chat images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat-images');

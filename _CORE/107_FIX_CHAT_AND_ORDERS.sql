-- [CORE] 107_FIX_CHAT_AND_ORDERS.sql
-- 1. Create chat-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('chat-images', 'chat-images', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage Policies for chat-images
DROP POLICY IF EXISTS "Chat Images Public Select" ON storage.objects;
CREATE POLICY "Chat Images Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'chat-images');

DROP POLICY IF EXISTS "Chat Images Public Insert" ON storage.objects;
CREATE POLICY "Chat Images Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chat-images');

-- 3. Add missing columns to messages for attachments
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS order_id TEXT,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'text',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 4. Add shop_id to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL;

-- 4. Fix RLS for orders Select
DROP POLICY IF EXISTS "Enable read access for all" ON public.orders;
CREATE POLICY "Enable read access for all" ON public.orders FOR SELECT USING (true);

-- 5. Fix Chat RLS for Anon (Wallet Users)
DROP POLICY IF EXISTS "Anon Select Conversations" ON public.conversations;
CREATE POLICY "Anon Select Conversations" ON public.conversations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anon Insert Conversations" ON public.conversations;
CREATE POLICY "Anon Insert Conversations" ON public.conversations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anon Select Participants" ON public.conversation_participants;
CREATE POLICY "Anon Select Participants" ON public.conversation_participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anon Insert Participants" ON public.conversation_participants;
CREATE POLICY "Anon Insert Participants" ON public.conversation_participants FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anon Select Messages" ON public.messages;
CREATE POLICY "Anon Select Messages" ON public.messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anon Insert Messages" ON public.messages;
CREATE POLICY "Anon Insert Messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Ensure all users can update conversations (for updated_at)
DROP POLICY IF EXISTS "Anon Update Conversations" ON public.conversations;
CREATE POLICY "Anon Update Conversations" ON public.conversations FOR UPDATE USING (true);

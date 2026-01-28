-- [CORE] 105_FIX_CHAT_ALL.sql
-- MASTER FIX FOR CHAT SYSTEM
-- This script combines all previous fixes (101, 102, 103, 104) into one execution.
-- GOAL: Allow unrestricted Chat creation, messaging, and connection between users (Wallet & Email).

-- 1. CONVERSATIONS TABLE
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
-- Fix Type Constraint (if strict) - We use 'p2p' now but let's be safe
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_type_check;
ALTER TABLE conversations ADD CONSTRAINT conversations_type_check CHECK (type IN ('support', 'p2p', 'private', 'group'));

-- RLS: Allow Public Access (Read/Write)
DROP POLICY IF EXISTS "Public Select Conversations" ON conversations;
DROP POLICY IF EXISTS "Public Insert Conversations" ON conversations;
DROP POLICY IF EXISTS "Public Update Conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated Select Conversations" ON conversations;

CREATE POLICY "Public Select Conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Public Insert Conversations" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Conversations" ON conversations FOR UPDATE USING (true);


-- 2. PARTICIPANTS TABLE
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Add missing columns
ALTER TABLE conversation_participants 
ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- RLS: Allow Public Access (Critical for seeing 'Other' user)
DROP POLICY IF EXISTS "Public Select Participants" ON conversation_participants;
DROP POLICY IF EXISTS "Public Insert Participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can view their own participations" ON conversation_participants;
DROP POLICY IF EXISTS "Authenticated Select Participants" ON conversation_participants;

CREATE POLICY "Public Select Participants" ON conversation_participants FOR SELECT USING (true);
CREATE POLICY "Public Insert Participants" ON conversation_participants FOR INSERT WITH CHECK (true);


-- 3. MESSAGES TABLE
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS: Allow Public Access
DROP POLICY IF EXISTS "Public Select Messages" ON messages;
DROP POLICY IF EXISTS "Public Insert Messages" ON messages;
DROP POLICY IF EXISTS "Authenticated Select Messages" ON messages;

CREATE POLICY "Public Select Messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Public Insert Messages" ON messages FOR INSERT WITH CHECK (true);


-- 4. PROFILES TABLE (Read Visibility)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Allow Public Read (So we can see names of people we chat with)
DROP POLICY IF EXISTS "Public Read Profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);

-- Keep update restricted to owner
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING ( id = auth.uid() );


-- 5. STORAGE (Products Bucket) - Just in case
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'products' );
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING ( bucket_id = 'products' );

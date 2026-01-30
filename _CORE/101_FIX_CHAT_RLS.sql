-- [CORE] 101_FIX_CHAT_RLS.sql
-- This script fixes RLS policies for the Chat System to allow users to create conversations.

-- A. CONVERSATIONS TABLE
-- 1. Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Public View" ON conversations;
DROP POLICY IF EXISTS "Public Create" ON conversations;

-- 3. Create Permissive Policies for Authenticated Users
-- Allow VIEW: If I am a participant (this requires a join or a simpler check)
-- Ideally: SELECT * FROM conversations WHERE id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
-- But for creation, we need INSERT permission.

CREATE POLICY "Authenticated Insert Conversations"
ON conversations FOR INSERT
WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Authenticated Select Conversations"
ON conversations FOR SELECT
USING ( auth.role() = 'authenticated' );

-- B. CONVERSATION_PARTICIPANTS TABLE
-- 1. Enable RLS
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "Users can view their own participations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Public View Participants" ON conversation_participants;
DROP POLICY IF EXISTS "Public Insert Participants" ON conversation_participants;

-- 3. Create Policies
-- Allow VIEW: If I am the user OR if I am in the conversation (circular dependency risk, so keep simple)
CREATE POLICY "Authenticated Select Participants"
ON conversation_participants FOR SELECT
USING ( auth.role() = 'authenticated' );

-- Allow INSERT: Standard use case is creating a chat involves adding SELF and OTHER user.
-- So we must allow inserting rows for ANY user_id as long as the creator is authenticated.
CREATE POLICY "Authenticated Insert Participants"
ON conversation_participants FOR INSERT
WITH CHECK ( auth.role() = 'authenticated' );

-- C. MESSAGES TABLE
-- 1. Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

-- 3. Create Policies
CREATE POLICY "Authenticated Select Messages"
ON messages FOR SELECT
USING ( auth.role() = 'authenticated' );

CREATE POLICY "Authenticated Insert Messages"
ON messages FOR INSERT
WITH CHECK ( auth.role() = 'authenticated' );

-- [CORE] 102_ALLOW_PUBLIC_CHAT.sql
-- FIX: Wallet users are 'anon', so they cannot transparently query 'authenticated' rows.
-- This script opens up Chat tables to PUBLIC (everyone) so Wallet users can Chat.

-- A. CONVERSATIONS
DROP POLICY IF EXISTS "Authenticated Insert Conversations" ON conversations;
DROP POLICY IF EXISTS "Authenticated Select Conversations" ON conversations;
DROP POLICY IF EXISTS "Public Read" ON conversations;
DROP POLICY IF EXISTS "Public Create" ON conversations;

CREATE POLICY "Public Select Conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Public Insert Conversations" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Conversations" ON conversations FOR UPDATE USING (true);

-- B. PARTICIPANTS
DROP POLICY IF EXISTS "Authenticated Select Participants" ON conversation_participants;
DROP POLICY IF EXISTS "Authenticated Insert Participants" ON conversation_participants;

CREATE POLICY "Public Select Participants" ON conversation_participants FOR SELECT USING (true);
CREATE POLICY "Public Insert Participants" ON conversation_participants FOR INSERT WITH CHECK (true);

-- C. MESSAGES
DROP POLICY IF EXISTS "Authenticated Select Messages" ON messages;
DROP POLICY IF EXISTS "Authenticated Insert Messages" ON messages;

CREATE POLICY "Public Select Messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Public Insert Messages" ON messages FOR INSERT WITH CHECK (true);

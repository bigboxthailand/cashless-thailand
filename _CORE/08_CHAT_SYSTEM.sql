-- 1. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('support', 'p2p')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Participants Table (Junction)
CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (conversation_id, user_id)
);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Null if system message or generic admin
    content TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE, -- True if sent by admin interface
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;

-- 5. Policies (Simple for MVP)
-- Allow anyone to read/write for now (in production we need tighter RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Open Policy: Auth users can do anything (Refine later)
CREATE POLICY "Enable all access for auth users" ON conversations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for auth users" ON conversation_participants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for auth users" ON messages FOR ALL USING (auth.role() = 'authenticated');

-- 6. Indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_participants_user_id ON conversation_participants(user_id);

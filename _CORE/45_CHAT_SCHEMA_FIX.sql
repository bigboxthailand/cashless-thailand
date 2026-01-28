
-- Fix missing columns in conversations table
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Ensure RLS is enabled
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Note: We skip the Realtime publication setup here to avoid syntax errors. 
-- If 'messages' table exists, you can enable Realtime via Dashboard > Database > Replication.

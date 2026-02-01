-- Add bot_disabled column to conversations table
-- This allows admins to disable the bot for specific conversations

ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS bot_disabled BOOLEAN DEFAULT false;

-- Add admin_handling column to track if admin is handling the conversation
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS admin_handling BOOLEAN DEFAULT false;

-- Add admin_id to track which admin is handling
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS handling_admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_bot_disabled ON conversations(bot_disabled);
CREATE INDEX IF NOT EXISTS idx_conversations_admin_handling ON conversations(admin_handling);

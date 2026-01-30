-- [CORE] 103_ADD_CHAT_LAST_READ.sql
-- FIX: The frontend tries to order by 'last_read_at', but it might be missing.
-- This script adds the column to prevent "400 Bad Request" errors.

ALTER TABLE conversation_participants 
ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

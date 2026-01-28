-- Delete the specific P2P conversation and all related data
-- Conversation ID: 1c470aca-e66b-4942-92a0-259028ed9ef7

-- 1. Delete Messages
DELETE FROM messages 
WHERE conversation_id = '1c470aca-e66b-4942-92a0-259028ed9ef7';

-- 2. Delete Participants
DELETE FROM conversation_participants 
WHERE conversation_id = '1c470aca-e66b-4942-92a0-259028ed9ef7';

-- 3. Delete Conversation
DELETE FROM conversations 
WHERE id = '1c470aca-e66b-4942-92a0-259028ed9ef7';

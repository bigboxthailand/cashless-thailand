-- Check P2P Conversations and their participants
SELECT 
    c.id as conversation_id,
    c.title,
    c.type,
    c.created_at,
    c.metadata,
    p.user_id,
    prof.full_name,
    prof.email,
    prof.wallet_address
FROM conversations c
JOIN conversation_participants p ON c.id = p.conversation_id
JOIN profiles prof ON p.user_id = prof.id
WHERE c.type = 'p2p'
ORDER BY c.updated_at DESC;

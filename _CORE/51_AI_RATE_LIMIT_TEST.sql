-- Quick test queries to verify AI rate limit functions work
-- Run these in Supabase SQL Editor after running the migration

-- 1. Check if table exists
SELECT COUNT(*) as table_exists FROM information_schema.tables 
WHERE table_name = 'ai_usage_tracking';

-- 2. Check if functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name IN ('check_ai_limit', 'increment_ai_usage', 'get_ai_usage_stats')
AND routine_schema = 'public';

-- 3. Test check_ai_limit function with dummy data
-- Replace 'your-user-id' and 'your-conversation-id' with real UUIDs from your database
SELECT check_ai_limit(
    (SELECT id FROM profiles LIMIT 1),
    (SELECT id FROM conversations LIMIT 1)
);

-- 4. Test increment_ai_usage function
SELECT increment_ai_usage(
    (SELECT id FROM profiles LIMIT 1),
    (SELECT id FROM conversations LIMIT 1)
);

-- 5. View current usage data
SELECT * FROM ai_usage_tracking LIMIT 10;

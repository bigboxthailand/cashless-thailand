-- [CORE] 21_DEBUG_SCHEMA.sql
-- 1. Check actual columns in products table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';

-- 2. Force Schema Cache Reload (Try this if column exists but error persists)
NOTIFY pgrst, 'reload schema';

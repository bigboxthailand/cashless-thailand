-- Attempt to just select everything to see what columns exist.
-- If 'title' column doesn't exist, we should rely on 'meta' JSON or generic selection.

SELECT * FROM products ORDER BY created_at DESC LIMIT 5;

-- To see the table structure (Columns)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products';

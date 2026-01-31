-- Check if products exist and are linked to the correct shop
SELECT 
    p.id as product_id,
    p.title, -- or name (based on schema)
    p.shop_id,
    s.name as shop_name,
    p.created_at
FROM products p
LEFT JOIN shops s ON s.id = p.shop_id
ORDER BY p.created_at DESC;

-- Also check RLS policies on products table
SELECT * FROM pg_policies WHERE tablename = 'products';

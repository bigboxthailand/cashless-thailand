-- 1. Check if orphans still exist
SELECT count(*) as orphaned_products_count FROM products WHERE shop_id IS NULL;

-- 2. List all shops and how many products they have
SELECT 
    s.id as shop_id,
    s.name as shop_name,
    s.owner_id,
    count(p.id) as product_count
FROM shops s
LEFT JOIN products p ON p.shop_id = s.id
GROUP BY s.id, s.name, s.owner_id
ORDER BY product_count DESC;

-- 3. Show a few recent products to see their assigned shop
SELECT 
    p.id as product_id,
    p.shop_id,
    s.name as assigned_shop_name,
    p.meta->>'title' as product_name
FROM products p
LEFT JOIN shops s ON s.id = p.shop_id
ORDER BY p.created_at DESC
LIMIT 5;

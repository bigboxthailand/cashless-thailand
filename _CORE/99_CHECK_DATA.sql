-- Check actual data of the last 5 products to verify shop_id and data integrity
SELECT 
    id,
    shop_id,
    meta->>'title' as product_name,
    category,
    created_at
FROM products
ORDER BY created_at DESC
LIMIT 5;

-- Also check how many products have NULL shop_id (Orphaned products)
SELECT count(*) as orphaned_products_count FROM products WHERE shop_id IS NULL;

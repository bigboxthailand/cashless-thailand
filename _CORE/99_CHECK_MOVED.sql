-- Check if any Admin-like products are still in Candy's Shop (Or whatever shop User owns)
-- We assume User's shop is the one with 'Candy' in name based on previous ctx.
SELECT 
    id, 
    shop_id, 
    meta->>'title' as name, 
    category 
FROM products 
WHERE 
    shop_id = (SELECT id FROM shops WHERE name = 'Candy''s Shop')
    AND (
        meta->>'title' ILIKE 'CryptoClock%' OR 
        meta->>'title' ILIKE 'BiTNode%' OR
        meta->>'title' ILIKE '%BLC' OR 
        meta->>'title' ILIKE 'Meta%'
    );

-- Also check where they ARE now
SELECT id, shop_id, meta->>'title' as name
FROM products
WHERE meta->>'title' ILIKE 'CryptoClock%'
LIMIT 5;

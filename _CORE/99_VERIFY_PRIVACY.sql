-- Verify that RLS and Data are correct/isolated
-- 1. Count My Products
SELECT COUNT(*) as my_products_count 
FROM products 
WHERE shop_id = (SELECT id FROM shops WHERE name = 'Candy''s Shop');

-- 2. Count Others' Products (Non-Candy)
SELECT COUNT(*) as other_shops_products_count 
FROM products 
WHERE shop_id != (SELECT id FROM shops WHERE name = 'Candy''s Shop');

-- 3. Show 'Other' Products (Should NOT be in your list)
SELECT id, shop_id, meta->>'title' as name 
FROM products 
WHERE shop_id != (SELECT id FROM shops WHERE name = 'Candy''s Shop');

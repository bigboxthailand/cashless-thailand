-- Check if products exist and are linked to the correct shop
SELECT 
    p.id as product_id,
    p.title, -- The schema setup says 'title' exists. If error persists, it might mean actual DB has 'name'.
    -- Let's try to select common potential columns or just * to be safe in a debug script.
    -- But since user got error "column p.title does not exist", it implies 'title' is WRONG.
    -- Based on SellerProductManager.jsx: "product.name || product.title".
    -- Let's check information_schema first or just use *
    p.created_at
FROM products p
ORDER BY p.created_at DESC;

-- BETTER DEBUG SCRIPT that checks columns first:
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products';

-- Then try to select with correct assumption (likely NO 'title' column, only 'meta' jsonb or 'name' added later?)
-- In _CORE/01 schema it defines `title text`. But migration 41 adds `shop_id`.
-- Maybe `title` was removed or never created if 01 wanst run properly?
-- Let's select * to see what's there.
SELECT * FROM products LIMIT 5;

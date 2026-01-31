-- [CORE] 69_MOVE_ADMIN_PRODUCTS.sql
-- Move "Main Website/Admin" products OUT of Candy's Shop
-- and back to "CryptoClock's Shop" (which seems to be the Admin shop).

DO $$
DECLARE
    admin_shop_id UUID;
BEGIN
    -- 1. Find the Admin Shop (CryptoClock's Shop)
    SELECT id INTO admin_shop_id FROM shops WHERE name = 'CryptoClock''s Shop' LIMIT 1;
    
    IF admin_shop_id IS NOT NULL THEN
        -- 2. Update products that match Admin/Main patterns
        UPDATE products
        SET shop_id = admin_shop_id
        WHERE 
            (
                meta->>'title' ILIKE 'CryptoClock%' OR 
                meta->>'title' ILIKE 'BiTNode%' OR
                meta->>'title' ILIKE 'BiTPos%' OR
                meta->>'title' ILIKE 'BiTTerm%' OR
                meta->>'title' ILIKE '%BLC' -- Bitcoin T-shirt by BLC
            )
            AND shop_id != admin_shop_id;
            
        RAISE NOTICE 'Moved Admin products back to Shop ID: %', admin_shop_id;
    ELSE
        RAISE NOTICE 'Admin Shop (CryptoClock) not found!';
    END IF;
END $$;

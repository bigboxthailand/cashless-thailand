-- [CORE] 69_MOVE_CRYPTOCLOCK_PRODUCTS.sql
-- Detect products named "CryptoClock%" currently in Candy's Shop (or any shop)
-- And move them to "CryptoClock's Shop".

DO $$
DECLARE
    crypto_shop_id UUID;
BEGIN
    -- 1. Find the destination shop ID
    SELECT id INTO crypto_shop_id FROM shops WHERE name = 'CryptoClock''s Shop' LIMIT 1;
    
    IF crypto_shop_id IS NOT NULL THEN
        -- 2. Update products that have 'CryptoClock' in their title (meta->>title or name)
        --    Note: In previous checks, 'name' was implicit or derived. 
        --    Let's check 'meta'->>'title' AND 'category' just in case.
        
        UPDATE products
        SET shop_id = crypto_shop_id
        WHERE 
            (meta->>'title' ILIKE '%CryptoClock%' OR category ILIKE '%Clock%')
            AND shop_id != crypto_shop_id;
            
        RAISE NOTICE 'Moved CryptoClock products to Shop ID: %', crypto_shop_id;
    ELSE
        RAISE NOTICE 'CryptoClock Shop not found! Cannot move products.';
    END IF;
END $$;

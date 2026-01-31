-- 1. Find the Shop ID for 'Candy''s Shop' (or whatever the user's shop is)
-- And update the orphaned products (shop_id IS NULL) to belong to that shop.

DO $$
DECLARE
    target_shop_id UUID;
BEGIN
    -- Try to find the shop by name (User mentioned Candy's Shop in image)
    SELECT id INTO target_shop_id FROM shops WHERE name = 'Candy''s Shop' LIMIT 1;

    -- If not found by name, try to find ANY active shop created recently (fallback)
    IF target_shop_id IS NULL THEN
        SELECT id INTO target_shop_id FROM shops ORDER BY created_at DESC LIMIT 1;
    END IF;

    IF target_shop_id IS NOT NULL THEN
        -- Update the Orphans
        UPDATE products
        SET shop_id = target_shop_id
        WHERE shop_id IS NULL;
        
        RAISE NOTICE 'Fixed orphaned products using Shop ID: %', target_shop_id;
    ELSE
        RAISE NOTICE 'Could not find a target shop to link products to.';
    END IF;
END $$;

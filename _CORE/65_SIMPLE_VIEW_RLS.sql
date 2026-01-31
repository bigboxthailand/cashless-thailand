-- Simplify the SELECT policy to be absolutely sure it works
DROP POLICY IF EXISTS "Sellers can view own products" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;

-- 1. Explicitly allow Shop Owners to view products in their shop
CREATE POLICY "Owner View Products" ON products
    FOR SELECT
    USING (
        shop_id IN (SELECT id FROM shops WHERE owner_id = auth.uid())
    );

-- 2. Keep Public Read (Important for storefront)
CREATE POLICY "Public View Products" ON products
    FOR SELECT
    USING (true);
    
-- Note: 'Using true' essentially overrides everything else for SELECT.
-- If this script is run, everyone (including Seller) should see ALL products.
-- This effectively disables RLS blocking for SELECT.
-- If user STILL can't see products after this, then it is 100% a Frontend Query issue (wrong shop_id filter).

-- Simplify the SELECT policy to be absolutely sure it works
-- DROP ALL POTENTIAL CONFLICTING POLICIES FIRST
DROP POLICY IF EXISTS "Sellers can view own products" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Owner View Products" ON products;
DROP POLICY IF EXISTS "Public View Products" ON products;
DROP POLICY IF EXISTS "Sellers can insert products" ON products; -- Re-create this if needed or rely on STRICT script later

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
    
-- 3. Restore Insert/Update permissions (basic) so they can keep working
CREATE POLICY "Sellers can insert products" ON products
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

CREATE POLICY "Sellers can update products" ON products
    FOR UPDATE
    USING (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

CREATE POLICY "Sellers can delete products" ON products
    FOR DELETE
    USING (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

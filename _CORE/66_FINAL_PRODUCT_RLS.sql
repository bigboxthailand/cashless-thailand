-- [CORE] 66_FINAL_PRODUCT_RLS.sql
-- Finalizes policies:
-- 1. SELECT: Allowed for everyone (Storefront needs to display products).
--    (In the future, if you add 'status' to products, we can restrict Public to 'active' only).
-- 2. INSERT/UPDATE/DELETE: Strictly RESTRICTED to Shop Owners.
-- 3. ADMIN: Implicitly allowed for all (via service role or if we add specific admin policy).

-- Reset
DROP POLICY IF EXISTS "Sellers can view own products" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Owner View Products" ON products;
DROP POLICY IF EXISTS "Public View Products" ON products;
DROP POLICY IF EXISTS "Sellers can insert products" ON products;
DROP POLICY IF EXISTS "Sellers can update products" ON products;
DROP POLICY IF EXISTS "Sellers can delete products" ON products;
DROP POLICY IF EXISTS "Allow all insert products" ON products;

-- 1. SELECT (PUBLIC)
CREATE POLICY "Public Read All" ON products
    FOR SELECT
    USING (true);

-- 2. INSERT (SELLER ONLY)
CREATE POLICY "Seller Insert Own" ON products
    FOR INSERT
    WITH CHECK (
        -- Shop ID must match a shop owned by the user
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

-- 3. UPDATE (SELLER ONLY)
CREATE POLICY "Seller Update Own" ON products
    FOR UPDATE
    USING (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

-- 4. DELETE (SELLER ONLY)
CREATE POLICY "Seller Delete Own" ON products
    FOR DELETE
    USING (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

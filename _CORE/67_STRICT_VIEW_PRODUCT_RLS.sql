-- [CORE] 67_STRICT_VIEW_PRODUCT_RLS.sql
-- Force "Strict Privacy" for Authenticated Users.
-- 1. Anonymous Users (Public): Can see ALL products (for Storefront).
-- 2. Authenticated Sellers: Can ONLY see their OWN products (Dashboard privacy).
--    (WARNING: This means a logged-in Seller cannot view other shops' products to buy/browse unless they logout).
-- 3. Service Role (Admin Admin): Bypasses RLS automatically.

-- Reset Policies
DROP POLICY IF EXISTS "Public Read All" ON products;
DROP POLICY IF EXISTS "Owner View Products" ON products;
DROP POLICY IF EXISTS "Public View Products" ON products;
DROP POLICY IF EXISTS "Sellers can view own products" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;

-- 1. STRICT VIEW POLICY
CREATE POLICY "Strict View Policy" ON products
    FOR SELECT
    USING (
        -- OPTION A: Public (Not Logged In) can see everything
        (auth.role() = 'anon')  
        
        OR
        
        -- OPTION B: Logged In User can see ONLY their own shop's products
        (auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id))
        
        OR
        
        -- OPTION C: Admin User (checks existence in profiles table with role='admin' if applicable, or rely on Service Role)
        -- Assuming Service Role bypasses this check anyway.
        -- If you have a specific Admin USER who logs in, add logical check here:
        (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    );

-- 2. RESTORE EDIT PERMISSIONS (Same as before)
DROP POLICY IF EXISTS "Seller Insert Own" ON products;
DROP POLICY IF EXISTS "Seller Update Own" ON products;
DROP POLICY IF EXISTS "Seller Delete Own" ON products;

CREATE POLICY "Seller Insert Own" ON products
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

CREATE POLICY "Seller Update Own" ON products
    FOR UPDATE USING (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

CREATE POLICY "Seller Delete Own" ON products
    FOR DELETE USING (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

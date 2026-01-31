-- [CORE] 68_SMART_PRODUCT_RLS.sql
-- FIX: Use auth.role() instead of auth.rolename()
-- Logic: "Smart" Visibility based on Status + Ownership

-- 1. Add 'status' column to products if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'status') THEN
        ALTER TABLE products ADD COLUMN status text DEFAULT 'active';
    END IF;
END $$;

-- 2. SMART RLS Policy
DROP POLICY IF EXISTS "Strict View Policy" ON products;
DROP POLICY IF EXISTS "Public Read All" ON products;
DROP POLICY IF EXISTS "Owner View Products" ON products;
DROP POLICY IF EXISTS "Sellers can view own products" ON products;
DROP POLICY IF EXISTS "Smart Product Visibility" ON products;

CREATE POLICY "Smart Product Visibility" ON products
    FOR SELECT
    USING (
        -- 1. Public (Anyone) can see ACTIVE products (Buying Mode)
        (status = 'active')
        
        OR
        
        -- 2. Owner can see ALL their products (Manager Mode)
        (auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id))
        
        OR
        
        -- 3. Admin/Service Role sees all
        -- Note: 'service_role' usually bypasses RLS, but explicit check is good.
        (auth.role() = 'service_role')
    );

-- Restore Strict Edit Policies (Just in case)
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

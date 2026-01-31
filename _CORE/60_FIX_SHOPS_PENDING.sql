-- FORCE FIX: Allow reading ALL shops (Active & Pending) for now to debug visibility issues
-- This ensures 'shops', 'profiles' are readable by public (anon) and authenticated users.

-- 1. SHOPS
DROP POLICY IF EXISTS "Public read shops" ON shops;
DROP POLICY IF EXISTS "Public read all shops" ON shops;

CREATE POLICY "Public read all shops" ON shops
    FOR SELECT
    TO anon, authenticated
    USING (true); -- Allows seeing pending shops too

-- 2. PROFILES (Just in case)
DROP POLICY IF EXISTS "Public read profiles" ON profiles;

CREATE POLICY "Public read profiles" ON profiles
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 3. GRANT PERMISSIONS
GRANT SELECT ON shops TO anon, authenticated;
GRANT SELECT ON profiles TO anon, authenticated;

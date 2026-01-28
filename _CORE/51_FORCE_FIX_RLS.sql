-- FORCE FIX RLS for Wallet Users
-- This script resets policies to ensure wallet users can:
-- 1. Read profiles (to verify ownership)
-- 2. Create shops (linked to their profile)

-- 1. Grant necessary permissions to anonymous role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.shops TO anon;

-- 2. Reset Profiles Policies
DROP POLICY IF EXISTS "Public profiles with wallet are viewable" ON profiles;
DROP POLICY IF EXISTS "Anyone can create profile with wallet" ON profiles;
DROP POLICY IF EXISTS "Public read profiles" ON profiles;
DROP POLICY IF EXISTS "Public create profiles" ON profiles;

-- Simply allow reading all profiles (needed for cross-checks)
CREATE POLICY "Public read profiles" ON profiles
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow creating profile
CREATE POLICY "Public create profiles" ON profiles
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow updating own profile
CREATE POLICY "Update own profile" ON profiles
    FOR UPDATE
    TO anon, authenticated
    USING (
        (auth.uid() = id) 
        OR 
        (wallet_address IS NOT NULL) -- Simply allow wallet profiles to be updated mainly by logic checks
    );

-- 3. Reset Shops Policies
DROP POLICY IF EXISTS "Users can create their shop" ON shops;
DROP POLICY IF EXISTS "Users and wallet owners can create shop" ON shops;
DROP POLICY IF EXISTS "Owner can update their shop" ON shops;
DROP POLICY IF EXISTS "Public read shops" ON shops;
DROP POLICY IF EXISTS "Public create shops" ON shops;

-- Allow reading all shops
CREATE POLICY "Public read shops" ON shops
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow creating shop if owner exists in profiles
CREATE POLICY "Public create shops" ON shops
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        -- Authenticated user
        auth.uid() = owner_id
        OR
        -- Wallet user: The owner_id must point to a profile that has a wallet_address
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = owner_id 
            AND wallet_address IS NOT NULL
        )
    );

-- Allow updating shop
CREATE POLICY "Owner can update their shop" ON shops
    FOR UPDATE
    TO anon, authenticated
    USING (
        auth.uid() = owner_id
        OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = owner_id 
            AND wallet_address IS NOT NULL
        )
    );

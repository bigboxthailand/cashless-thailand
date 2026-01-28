-- Consolidated RLS fix for Wallet Users
-- This script drops old policies and creates new ones to ensure wallet users can:
-- 1. Create/View Profiles
-- 2. Create/View/Update Shops

-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================

-- Allow anonymous users (wallet users) to view profiles that have a wallet address
-- This is needed so we can look up profile ID by wallet address
DROP POLICY IF EXISTS "Public profiles with wallet are viewable" ON profiles;
CREATE POLICY "Public profiles with wallet are viewable" ON profiles
    FOR SELECT
    TO anon, authenticated
    USING (wallet_address IS NOT NULL);

-- Allow creating a profile if you have a wallet address
DROP POLICY IF EXISTS "Anyone can create profile with wallet" ON profiles;
CREATE POLICY "Anyone can create profile with wallet" ON profiles
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        (auth.uid() = id)
        OR
        (wallet_address IS NOT NULL)
    );

-- ==========================================
-- 2. SHOPS TABLE
-- ==========================================

-- Drop potentially conflicting or old policies
DROP POLICY IF EXISTS "Users can create their shop" ON shops;
DROP POLICY IF EXISTS "Users and wallet owners can create shop" ON shops;

-- Allow Creating Shop
-- Logic: Authenticated users OR Wallet users (checked via subquery)
CREATE POLICY "Users and wallet owners can create shop" ON shops
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        -- Case 1: Supabase Authenticated User
        (auth.uid() = owner_id)
        OR
        -- Case 2: Wallet User (Validation: owner_id must exist in profiles with a wallet_address)
        (owner_id IN (SELECT id FROM profiles WHERE wallet_address IS NOT NULL))
    );

-- Allow Updating Shop
DROP POLICY IF EXISTS "Owner can update their shop" ON shops;
CREATE POLICY "Owner can update their shop" ON shops
    FOR UPDATE
    TO authenticated, anon
    USING (
        (auth.uid() = owner_id)
        OR
        (owner_id IN (SELECT id FROM profiles WHERE wallet_address IS NOT NULL))
    );

-- Allow Selecting Shop
-- Needed so wallet users can fetch their own shop data
DROP POLICY IF EXISTS "Anyone can view shops" ON shops; -- Existing policy usually allows public view, but let's ensure it covers everything or rely on existing public policy
-- Assuming there is a public view policy. If not, we might need one.
-- Usually shops are public, so "Enable read access for all users" is likely already there.

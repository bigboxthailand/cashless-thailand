-- Fix RLS policies on profiles table to allow wallet users to create profiles
-- This is needed because wallet users don't have Supabase auth sessions

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;

-- Allow anonymous users to INSERT profiles with wallet_address
-- This is safe because wallet_address has UNIQUE constraint
CREATE POLICY "Anyone can create profile with wallet" ON profiles
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        -- Either authenticated user creating their own profile
        (auth.uid() = id)
        OR
        -- Or anonymous user creating wallet-based profile
        (wallet_address IS NOT NULL)
    );

-- Ensure users can still view their own profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Allow public to view profiles with wallet addresses (for shop owners)
CREATE POLICY "Public can view wallet profiles" ON profiles
    FOR SELECT
    TO anon, authenticated
    USING (wallet_address IS NOT NULL);

-- Users can update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

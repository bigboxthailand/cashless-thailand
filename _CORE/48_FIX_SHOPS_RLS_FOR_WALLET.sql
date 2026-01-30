-- Fix RLS policies on shops table to allow wallet users to create shops
-- Wallet users don't have auth.uid(), so we need to check via profiles.wallet_address

-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create their own shop" ON shops;

-- Allow shop creation for both authenticated users and wallet users
CREATE POLICY "Users and wallet owners can create shop" ON shops
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        -- Either authenticated user creating their own shop
        (auth.uid() = owner_id)
        OR
        -- Or owner_id belongs to a profile with a wallet_address (wallet user)
        (owner_id IN (SELECT id FROM profiles WHERE wallet_address IS NOT NULL))
    );

-- Also update the UPDATE policy to allow wallet users to update their shops
DROP POLICY IF EXISTS "Owner can update their shop" ON shops;
CREATE POLICY "Owner can update their shop" ON shops
    FOR UPDATE
    TO authenticated, anon
    USING (
        (auth.uid() = owner_id)
        OR
        (owner_id IN (SELECT id FROM profiles WHERE wallet_address IS NOT NULL))
    );

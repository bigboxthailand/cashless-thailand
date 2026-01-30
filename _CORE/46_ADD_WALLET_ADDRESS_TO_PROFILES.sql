-- Add wallet_address column to profiles table for Metamask users
-- This allows wallet users to create shops without Supabase OAuth

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON profiles(wallet_address);

-- Comment for clarity
COMMENT ON COLUMN profiles.wallet_address IS 'Ethereum wallet address for Metamask/Web3 authentication';

-- Add KYC verification status to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_kyc_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS kyc_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS kyc_data JSONB DEFAULT '{}'::jsonb;

-- Comment on columns
COMMENT ON COLUMN profiles.is_kyc_verified IS 'Whether the user has completed formal identity verification';
COMMENT ON COLUMN profiles.kyc_data IS 'Stores metadata for KYC such as phone, ID number hash, or other verification details';

-- Ensure it's reachable by Supabase
NOTIFY pgrst, 'reload schema';

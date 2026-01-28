-- [CORE] 104_FIX_PROFILES_READ.sql
-- FIX: Users cannot see each other's names in Chat because 'profiles' table is restricted.
-- This script allows ANYONE (Public) to view profile names and avatars.

-- 1. Enable RLS (just in case)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop restrictive policies
DROP POLICY IF EXISTS "Public Read Profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated can view all profiles" ON profiles;

-- 3. Create Permissive Read Policy
-- Allow anyone (including random wallet users) to read basic profile info.
CREATE POLICY "Public Read Profiles"
ON profiles FOR SELECT
USING (true);

-- 4. Keep strict write policies (Users can only update their own)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING ( id = auth.uid() ); 
-- Note: Wallet users might need a different update strategy, but READ is the priority for Chat.

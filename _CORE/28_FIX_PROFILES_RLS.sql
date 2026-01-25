-- Check existing policies on profiles
SELECT policyname, cmd, qual, with_check FROM pg_policies WHERE tablename = 'profiles';

-- Ensure public can read profiles (needed for showing reviewer names)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING ( true );

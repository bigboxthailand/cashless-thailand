-- [CORE] 108_FIX_SOCIAL_LOGIN_TRIGGER.sql
-- 1. Create a robust function to handle new user signups (Social Login)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert a new profile into public.profiles
  -- Using COALESCE to handle cases where metadata might be missing
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
    
  RETURN new;
END;
$$;

-- 2. (Re)Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Ensure profiles table has correct RLS for the trigger to work (via service_role or authenticated)
-- The function uses SECURITY DEFINER, so it runs with the privileges of the creator (usually a superuser/admin).
-- But we ensure the public.profiles has Unified insert policy enabled.
DROP POLICY IF EXISTS "Unified profiles insert" ON public.profiles;
CREATE POLICY "Unified profiles insert" ON public.profiles FOR INSERT WITH CHECK (true);

-- [CORE] 61_ADMIN_ROLE_SETUP.sql
-- Add role column to profiles and set initial admin

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Set the initial admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'mycryptoclock@gmail.com';

-- Update RLS for shops deletion to use role instead of hardcoded email
DROP POLICY IF EXISTS "Admins can delete shops" ON public.shops;
CREATE POLICY "Admins can delete shops" ON public.shops
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
    OR
    (auth.jwt() ->> 'email' = 'mycryptoclock@gmail.com') -- Fallback
);

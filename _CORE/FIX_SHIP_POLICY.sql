-- [FIX] Allow UPDATE without authentication (for Demo/Development)
-- This allows the Ship Order button to work even without login

DROP POLICY IF EXISTS "Enable update for logged-in users" ON public.orders;
CREATE POLICY "Enable update for all users" ON public.orders 
FOR UPDATE USING (true);

-- Verify
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'orders';

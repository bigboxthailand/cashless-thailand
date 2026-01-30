-- [CORE] 106_FIX_ADMIN_DELETION.sql
-- Enables administrators to delete shops from the admin panel

-- Add policy for Shop Deletion (Admin Only)
-- We identify admins by their email for now as per AdminLayout.astro logic
DROP POLICY IF EXISTS "Admins can delete shops" ON public.shops;

CREATE POLICY "Admins can delete shops" ON public.shops
FOR DELETE 
USING (
    auth.jwt() ->> 'email' = 'mycryptoclock@gmail.com'
);

-- Note: payouts table already has ON DELETE CASCADE for shop_id
-- products table has ON DELETE SET NULL for shop_id
-- If we want to delete products too when a shop is deleted, we would need to update products FK.
-- For now, SET NULL is safer as per 41_SELLER_SYSTEM_MIGRATION.sql

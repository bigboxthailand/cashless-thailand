-- Add policy specifically for Sellers to VIEW their own products, regardless of status
-- This fixes the issue where a seller creates a product but cannot see it if it's not 'active'
-- or if the public policy is too restrictive.

DROP POLICY IF EXISTS "Sellers can view own products" ON products;

CREATE POLICY "Sellers can view own products" ON products
    FOR SELECT
    USING (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

-- Also ensure Generic Public Access allows viewing active products (just in case it was missing or messed up)
-- This might duplicate existing ones, but 'IF NOT EXISTS' isn't supported for policies easily.
-- We'll just define the specific Seller one which is the critical fix.

-- Optional: Logic for Wallet Users (who have no auth.uid)
-- If we want Wallet Users to query their own products, we need a policy that allows access based on something else?
-- Supabase RLS works on the DATABASE user. Anonymous wallet users are 'anon'.
-- They can only access what 'anon' can access.
-- If we want 'anon' to see their own products, we can't easily distinguish "My Product" from "Your Product" without a token.
-- BUT, in this app, Wallet Users act via client-side access.
-- If the product is fetched by ID or shop_id, and it's public, they see it.
-- If we want private drafts for wallet users, that's blocked by current architecture unless we use a custom signed token.
-- For now, allow public read of ALL products? Or just assume Email Auth for sellers (which seems to be the primary flow for Shop Owners).

-- Let's stick to fixing the Authenticated Seller flow first.

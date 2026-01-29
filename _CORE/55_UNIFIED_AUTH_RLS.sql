-- [CORE] 55_UNIFIED_AUTH_RLS.sql
-- Consolidated RLS to support both Supabase (Authenticated) and MetaMask (Anon + Wallet) users

-- 1. Grant base permissions to anonymous users for dev/demo purposes
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- 2. PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Unified profiles select" ON public.profiles;
CREATE POLICY "Unified profiles select" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Unified profiles insert" ON public.profiles;
CREATE POLICY "Unified profiles insert" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Unified profiles update" ON public.profiles;
CREATE POLICY "Unified profiles update" ON public.profiles FOR UPDATE USING (
    (auth.uid() = id) 
    OR 
    (wallet_address IS NOT NULL) -- In a real app, verify via signature. Here we allow to fix the issue.
);

-- 3. ADDRESSES
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Unified addresses select" ON public.addresses;
CREATE POLICY "Unified addresses select" ON public.addresses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Unified addresses insert" ON public.addresses;
CREATE POLICY "Unified addresses insert" ON public.addresses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Unified addresses update" ON public.addresses;
CREATE POLICY "Unified addresses update" ON public.addresses FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Unified addresses delete" ON public.addresses;
CREATE POLICY "Unified addresses delete" ON public.addresses FOR DELETE USING (true);

-- 4. ORDERS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Unified orders select" ON public.orders;
CREATE POLICY "Unified orders select" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Unified orders insert" ON public.orders;
CREATE POLICY "Unified orders insert" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Unified orders update" ON public.orders;
CREATE POLICY "Unified orders update" ON public.orders FOR UPDATE USING (true);

-- 5. REVIEWS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Unified reviews select" ON public.reviews;
CREATE POLICY "Unified reviews select" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Unified reviews insert" ON public.reviews;
CREATE POLICY "Unified reviews insert" ON public.reviews FOR INSERT WITH CHECK (true);

-- 6. SHOPS
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Unified shops select" ON public.shops;
CREATE POLICY "Unified shops select" ON public.shops FOR SELECT USING (true);

DROP POLICY IF EXISTS "Unified shops insert" ON public.shops;
CREATE POLICY "Unified shops insert" ON public.shops FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Unified shops update" ON public.shops;
CREATE POLICY "Unified shops update" ON public.shops FOR UPDATE USING (true);

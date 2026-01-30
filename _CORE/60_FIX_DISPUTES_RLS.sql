-- [CORE] 60_FIX_DISPUTES_RLS.sql
-- Allow everyone to view disputes so they show up in the Admin Panel
-- (Consistency with other Unified policies in 55_UNIFIED_AUTH_RLS.sql)

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- 1. SELECT POLICY
DROP POLICY IF EXISTS "Users can view their own disputes" ON public.disputes;
DROP POLICY IF EXISTS "Unified disputes select" ON public.disputes;
CREATE POLICY "Unified disputes select" ON public.disputes FOR SELECT USING (true);

-- 2. INSERT POLICY
DROP POLICY IF EXISTS "Users can create disputes" ON public.disputes;
DROP POLICY IF EXISTS "Unified disputes insert" ON public.disputes;
CREATE POLICY "Unified disputes insert" ON public.disputes FOR INSERT WITH CHECK (true);

-- 3. UPDATE POLICY
DROP POLICY IF EXISTS "Unified disputes update" ON public.disputes;
CREATE POLICY "Unified disputes update" ON public.disputes FOR UPDATE USING (true);

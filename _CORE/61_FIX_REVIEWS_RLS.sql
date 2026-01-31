-- Fix RLS for reviews table
-- Ensure everyone can read reviews
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reviews;
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;

-- Policy: Allow public read
CREATE POLICY "Public read reviews" ON public.reviews
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Ensure authenticated users can insert (handled in other files, but ensuring here)
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
CREATE POLICY "Users can create reviews" ON public.reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
    
-- Grant permissions
GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;

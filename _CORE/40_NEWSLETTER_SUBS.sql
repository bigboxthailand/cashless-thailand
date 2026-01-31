-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (subscribe)
CREATE POLICY "Enable insert for public" ON public.newsletter_subscribers
    FOR INSERT
    WITH CHECK (true);

-- Policy: Allow admin to view all (using service role or specific admin logic if implemented, for now service_role usually bypasses, but let's add a basic select for authenticated users if needed, or restricting to just admin if possible. Since we don't have advanced role management here yet, we'll allow authenticated or just service role.)
-- Actually, for Admin Dashboard, the user is likely authenticated.
CREATE POLICY "Enable read for authenticated users only" ON public.newsletter_subscribers
    FOR SELECT
    TO authenticated
    USING (true);

-- Grant permissions
GRANT SELECT, INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

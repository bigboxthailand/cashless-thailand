-- [CORE] 110_BLOG_SYSTEM_SETUP.sql
-- คำสั่งสำหรับสร้างระบบ Blog แบบ Dynamic (Posts, Comments, Votes)

-- 1. Create Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    short_description TEXT,
    content TEXT, -- HTML or Markdown
    image_url TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    author_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Blog Comments Table
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- Reference profiles for easy name fetching
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Blog Votes Table (Thumb Up/Down)
CREATE TABLE IF NOT EXISTS public.blog_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    vote_type INTEGER CHECK (vote_type IN (1, -1)), -- 1 = Up, -1 = Down
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- 4. Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_votes ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Blog Posts
DROP POLICY IF EXISTS "Public can view published posts" ON public.blog_posts;
CREATE POLICY "Public can view published posts" ON public.blog_posts
    FOR SELECT USING (is_published = true OR auth.role() = 'authenticated'); -- Allow all to see published, or auth users for preview if needed (should check admin role later)

DROP POLICY IF EXISTS "Admin can manage posts" ON public.blog_posts;
CREATE POLICY "Admin can manage posts" ON public.blog_posts
    FOR ALL USING (true); -- Broad for dev, refined in code or via service_role

-- 6. Policies for Comments
DROP POLICY IF EXISTS "Anyone can view comments" ON public.blog_comments;
CREATE POLICY "Anyone can view comments" ON public.blog_comments
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can comment" ON public.blog_comments;
CREATE POLICY "Authenticated users can comment" ON public.blog_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Policies for Votes
DROP POLICY IF EXISTS "Anyone can view votes" ON public.blog_votes;
CREATE POLICY "Anyone can view votes" ON public.blog_votes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can vote" ON public.blog_votes;
CREATE POLICY "Authenticated users can vote" ON public.blog_votes
    FOR ALL USING (auth.uid() = user_id);

-- 8. Grant Permissions
GRANT ALL ON TABLE public.blog_posts TO anon, authenticated;
GRANT ALL ON TABLE public.blog_comments TO anon, authenticated;
GRANT ALL ON TABLE public.blog_votes TO anon, authenticated;

-- 9. Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.blog_posts
    SET view_count = view_count + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

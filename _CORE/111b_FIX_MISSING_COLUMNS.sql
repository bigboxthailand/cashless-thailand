-- SQL Patch: 111b_FIX_MISSING_COLUMNS.sql
-- Description: Adds missing columns and functions if you already ran the previous blog setup.

-- 1. Add view_count column to blog_posts
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='view_count') THEN
        ALTER TABLE public.blog_posts ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Create or Update the increment function
CREATE OR REPLACE FUNCTION public.increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.blog_posts
    SET view_count = view_count + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Regrant permissions
GRANT ALL ON TABLE public.blog_posts TO anon, authenticated;

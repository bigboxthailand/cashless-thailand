-- [CORE] 20_FIX_SCHEMA_ISSUES.sql
-- Fixes schema issues preventing Profile/Order History from working correctly

-- 1. Fix missing Foreign Key for order_items -> products mapping
-- This allows Supabase to fetch product details (name, image) when querying orders
ALTER TABLE public.order_items
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES public.products (id)
ON DELETE SET NULL;

-- 2. Fix missing 'updated_at' column in profiles
-- This is required for saving/updating profile information
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 1. Create Shops Table
CREATE TABLE IF NOT EXISTS shops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES profiles(id) NOT NULL UNIQUE, -- One shop per user for now
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE, -- for URL
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active', -- active, suspended, banned
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add shop_id to Products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id) ON DELETE SET NULL;

-- 3. Enable RLS on Shops
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

-- 4. Shops Policies
-- 4.1 Everyone can view active shops
CREATE POLICY "Public can view active shops" ON shops
    FOR SELECT
    USING (status = 'active');

-- 4.2 Authenticated users can create a shop (One per user enforced by UNIQUE constraint)
CREATE POLICY "Users can create their own shop" ON shops
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- 4.3 Owner can update their shop
CREATE POLICY "Owner can update their shop" ON shops
    FOR UPDATE
    USING (auth.uid() = owner_id);

-- 5. Update Products Policies for Multi-Vendor
-- Note: Existing policies might be "Admin All" and "Public Read". We need to ADD Seller policies.

-- 5.1 Sellers can INSERT products into their shop
CREATE POLICY "Sellers can insert products" ON products
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

-- 5.2 Sellers can UPDATE their own products
CREATE POLICY "Sellers can update their products" ON products
    FOR UPDATE
    USING (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

-- 5.3 Sellers can DELETE their own products
CREATE POLICY "Sellers can delete their products" ON products
    FOR DELETE
    USING (
        auth.uid() IN (SELECT owner_id FROM shops WHERE id = shop_id)
    );

-- 6. Grant Permissions (Optional but good practice if using custom roles, here for service_role/anon/authenticated)
GRANT SELECT ON shops TO authenticated, anon;
GRANT INSERT, UPDATE ON shops TO authenticated;

-- 1. Create Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- The reporter (Buyer)
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open', -- open, resolved_refund, resolved_close
    admin_notes TEXT,
    evidence_images JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can see their own disputes
CREATE POLICY "Users can view their own disputes" ON disputes
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create disputes for their own orders (Basic check, app logic should enforce order ownership more strictly if needed)
CREATE POLICY "Users can create disputes" ON disputes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can do everything (Assuming service_role or admin flag, but simpler for now: public read if needed? No, keep strict)
-- Note: Supabase Admin/Dashboard users usually bypass RLS, or we need a specific policy for admin users table if it exists.
-- For now, we'll assume the App Admin uses a client that might need policy OR uses service role.
-- Adding a broad policy for now if specific admin check logic exists, otherwise these 2 are fine for customers.

-- 4. Auto-Complete Function
CREATE OR REPLACE FUNCTION auto_complete_orders()
RETURNS void AS $$
BEGIN
    UPDATE orders
    SET 
        shipping_status = 'delivered',
        received_at = NOW(),
        updated_at = NOW()
    WHERE 
        shipping_status = 'shipped' 
        AND shipped_at < (NOW() - INTERVAL '7 days')
        AND NOT EXISTS (
            SELECT 1 FROM disputes 
            WHERE disputes.order_id = orders.id 
            AND disputes.status = 'open'
        );
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger/Cron suggestion (Comment only)
-- To automate this, you would enable pg_cron extension and run:
-- SELECT cron.schedule('0 0 * * *', $$SELECT auto_complete_orders()$$);

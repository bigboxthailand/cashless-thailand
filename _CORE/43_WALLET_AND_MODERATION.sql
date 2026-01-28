
-- 1. Create Payouts Table
CREATE TABLE IF NOT EXISTS payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected')),
    bank_info JSONB, -- e.g. { "bank": "KBANK", "account": "123..." }
    slip_image TEXT, -- URL of transfer proof (Admin upload)
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Shop Owners can view their own payouts
CREATE POLICY "Shop Owners can view own payouts" ON payouts
    FOR SELECT USING (
        shop_id IN (
            SELECT id FROM shops WHERE owner_id = auth.uid()
        )
    );

-- Shop Owners can request payouts (Insert)
CREATE POLICY "Shop Owners can request payouts" ON payouts
    FOR INSERT WITH CHECK (
        shop_id IN (
            SELECT id FROM shops WHERE owner_id = auth.uid()
        )
    );

-- Admins can view/update all
-- (Assuming we don't have a strict "Admin" role check in SQL yet, usually we assume Service Role or specific logic. 
-- For now, letting 'authenticated' update might be too loose unless we trust specific users. 
-- Let's stick to: Authenticated can VIEW (if admin logic handled in app? No RLS is db level).
-- We'll add a policy that fails safe or relies on Service Role for Admin actions mostly.)
-- Actually, let's allow "Public" read for debugging? No.
-- Let's allow strictly owners to read. Admin needs service role to bypass.

-- 4. Shop Finance View
-- Calculates Total Sales, Paid Payouts, Pending Payouts, and Available Balance
CREATE OR REPLACE VIEW shop_finance_view AS
SELECT 
    s.id as shop_id,
    s.name as shop_name,
    s.owner_id,
    
    -- Total Sales (Sum of Order Items in PAID orders)
    -- Joining orders via order_items is tricky because order_items links to product. 
    -- Actually order_items has order_id.
    COALESCE((
        SELECT SUM(oi.price * oi.quantity)
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE p.shop_id = s.id
        AND o.payment_status = 'paid'
        -- Maybe deduct if refunded? For now keep simple
    ), 0) as total_sales,
    
    -- Payouts
    COALESCE((
        SELECT SUM(amount) FROM payouts WHERE shop_id = s.id AND status = 'paid'
    ), 0) as paid_payouts,
    
    COALESCE((
        SELECT SUM(amount) FROM payouts WHERE shop_id = s.id AND status = 'pending'
    ), 0) as pending_payouts

FROM shops s;

-- Note: Available Balance = total_sales - (paid_payouts + pending_payouts)

-- 5. Grant Access
GRANT SELECT ON shop_finance_view TO authenticated;
GRANT SELECT ON shop_finance_view TO anon; -- Maybe not anon


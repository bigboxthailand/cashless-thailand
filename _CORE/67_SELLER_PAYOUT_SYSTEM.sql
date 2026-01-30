-- 📑 67_SELLER_PAYOUT_SYSTEM
-- Add Platform Commission & Payout Tracking

-- 1. Add Commission Rate to Store Settings
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS platform_commission_rate NUMERIC DEFAULT 0;

-- 2. Add Payout Tracking to Order Items
-- We track payout at the item level to support multiple sellers per order
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS payout_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payout_proof_url TEXT,
ADD COLUMN IF NOT EXISTS payout_at TIMESTAMPTZ;

-- 3. Create a view for Admin to see aggregated payouts per order and seller
CREATE OR REPLACE VIEW admin_payout_summary AS
SELECT 
    oi.order_id,
    p.shop_id,
    s.name as shop_name,
    s.promptpay_id,
    SUM(oi.price * oi.quantity) as gross_amount,
    (SELECT platform_commission_rate FROM store_settings LIMIT 1) as commission_rate,
    SUM(oi.price * oi.quantity) * (SELECT platform_commission_rate / 100.0 FROM store_settings LIMIT 1) as commission_amount,
    SUM(oi.price * oi.quantity) * (1 - (SELECT platform_commission_rate / 100.0 FROM store_settings LIMIT 1)) as net_amount,
    EVERY(oi.payout_status = 'paid') as is_fully_paid
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN shops s ON p.shop_id = s.id
GROUP BY oi.order_id, p.shop_id, s.name, s.promptpay_id;

COMMENT ON COLUMN store_settings.platform_commission_rate IS 'Percentage taken by the platform from each sale (e.g., 5.0 for 5%)';

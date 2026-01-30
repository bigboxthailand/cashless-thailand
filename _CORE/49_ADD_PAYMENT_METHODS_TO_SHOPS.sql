-- Add payment method fields to shops table for seller payouts
-- Sellers can provide PromptPay ID (Thai mobile or national ID) and Lightning wallet address

ALTER TABLE shops 
ADD COLUMN IF NOT EXISTS promptpay_id TEXT,
ADD COLUMN IF NOT EXISTS lightning_address TEXT;

-- Add comments for clarity
COMMENT ON COLUMN shops.promptpay_id IS 'PromptPay identifier: 10-digit mobile number or 13-digit Thai national ID';
COMMENT ON COLUMN shops.lightning_address IS 'Bitcoin Lightning Network wallet address for receiving payments';

-- Create index for faster lookups (optional but good for admin queries)
CREATE INDEX IF NOT EXISTS idx_shops_promptpay ON shops(promptpay_id) WHERE promptpay_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_shops_lightning ON shops(lightning_address) WHERE lightning_address IS NOT NULL;

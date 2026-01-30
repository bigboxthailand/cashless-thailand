-- Add VAT Settings to store_settings
ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS vat_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS vat_rate NUMERIC DEFAULT 7.0;

-- Comment on columns
COMMENT ON COLUMN store_settings.vat_enabled IS 'Toggle to show/hide VAT in invoices and dashboard';
COMMENT ON COLUMN store_settings.vat_rate IS 'The percentage of VAT to calculate (default 7%)';

-- Default to FALSE for existing installations to stay safe
UPDATE store_settings SET vat_enabled = FALSE WHERE vat_enabled IS NULL;

-- Notify
NOTIFY pgrst, 'reload schema';

-- 📑 63_ACCOUNTING_SYSTEM
-- Setup Sequential Invoice and Receipt Logic

-- 1. Add Columns to Orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS invoice_no TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS receipt_no TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS tax_id TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS billing_address TEXT;

-- 1.1 Add Store ID columns to Settings
ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS store_tax_id TEXT,
ADD COLUMN IF NOT EXISTS store_address TEXT,
ADD COLUMN IF NOT EXISTS store_phone TEXT,
ADD COLUMN IF NOT EXISTS store_email TEXT,
ADD COLUMN IF NOT EXISTS store_logo_url TEXT;

-- 2. Create a sequence for Invoices if not exists
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS receipt_seq START 1000;

-- 3. Function to generate Invoice Number (CT-YYYYMM-XXXX)
CREATE OR REPLACE FUNCTION generate_invoice_no()
RETURNS TRIGGER AS $$
DECLARE
    year_month TEXT;
    next_val INT;
BEGIN
    -- Format: CT-202601-1001
    year_month := to_char(CURRENT_DATE, 'YYYYMM');
    SELECT nextval('invoice_seq') INTO next_val;
    NEW.invoice_no := 'CT-' || year_month || '-' || next_val;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger to auto-generate Invoice No on NEW Order
DROP TRIGGER IF EXISTS trigger_generate_invoice_no ON orders;
CREATE TRIGGER trigger_generate_invoice_no
BEFORE INSERT ON orders
FOR EACH ROW
WHEN (NEW.invoice_no IS NULL)
EXECUTE FUNCTION generate_invoice_no();

-- 5. Function to generate Receipt Number on Payment
CREATE OR REPLACE FUNCTION handle_receipt_on_payment()
RETURNS TRIGGER AS $$
DECLARE
    next_val INT;
BEGIN
    -- Only generate receipt if payment_status changes to 'paid' and it doesn't have a receipt_no yet
    IF (NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status <> 'paid') AND NEW.receipt_no IS NULL) THEN
        SELECT nextval('receipt_seq') INTO next_val;
        NEW.receipt_no := 'RE-' || to_char(CURRENT_DATE, 'YYYYMM') || '-' || next_val;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger for Receipt Generation
DROP TRIGGER IF EXISTS trigger_handle_receipt_on_payment ON orders;
CREATE TRIGGER trigger_handle_receipt_on_payment
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION handle_receipt_on_payment();

COMMENT ON COLUMN orders.invoice_no IS 'Sequential invoice number generated upon order creation.';
COMMENT ON COLUMN orders.receipt_no IS 'Sequential receipt number generated only after payment is confirmed.';

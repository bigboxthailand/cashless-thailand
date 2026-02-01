-- Add seller location fields to shops table
ALTER TABLE shops 
ADD COLUMN IF NOT EXISTS district VARCHAR(100),
ADD COLUMN IF NOT EXISTS province VARCHAR(100);

-- Add index for location queries
CREATE INDEX IF NOT EXISTS idx_shops_province ON shops(province);
CREATE INDEX IF NOT EXISTS idx_shops_district ON shops(district);

-- Add comment
COMMENT ON COLUMN shops.district IS 'Seller district (อำเภอ) for shipping estimation';
COMMENT ON COLUMN shops.province IS 'Seller province (จังหวัด) for shipping estimation';

-- Fix the NULL product_id using the valid Base Product ID (Foreign Key compatible)
UPDATE reviews 
SET product_id = 'bitcoin-t-shirt--by-blc' 
WHERE product_id IS NULL AND created_at > NOW() - INTERVAL '1 day';

-- Verify fix
SELECT * FROM reviews WHERE product_id LIKE 'bitcoin%';

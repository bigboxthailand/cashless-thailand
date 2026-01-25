-- Fix the NULL product_id for the recent review (assigning it to the bitcoin t-shirt)
UPDATE reviews 
SET product_id = 'bitcoin-t-shirt--by-blc-standard' 
WHERE product_id IS NULL AND created_at > NOW() - INTERVAL '1 day';

-- Verify fix
SELECT * FROM reviews WHERE product_id LIKE 'bitcoin%';

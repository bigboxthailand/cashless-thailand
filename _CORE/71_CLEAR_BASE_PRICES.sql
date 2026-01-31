-- [CORE] 71_CLEAR_BASE_PRICES.sql
-- Remove redundant basePrice and comparePrice from top-level pricing JSON
-- to avoid confusion with variant prices.

UPDATE products
SET pricing = pricing - 'basePrice' - 'comparePrice'
WHERE config->'variants' IS NOT NULL 
  AND jsonb_array_length(config->'variants') > 0;

-- Optional: If you want to clear it even for products without variants (Not recommended unless you add variants first)
-- UPDATE products SET pricing = pricing - 'basePrice' - 'comparePrice'; 

-- Verify the result
SELECT id, pricing, config->'variants' as variants 
FROM products 
LIMIT 5;

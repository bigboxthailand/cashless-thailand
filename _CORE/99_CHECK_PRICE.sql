-- Check price data for Meta001
SELECT 
    id, 
    meta->>'title' as name, 
    price,         -- Base Price
    pricing,       -- JSONB Pricing structure
    config         -- Variants etc
FROM products 
WHERE meta->>'title' ILIKE '%Meta001%' OR meta->>'title' ILIKE '%Hardware Wallet%';

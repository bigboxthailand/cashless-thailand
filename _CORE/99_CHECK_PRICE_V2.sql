-- Check price data for Meta001 (Column 'price' might not exist, checking JSONB fields)
SELECT 
    id, 
    meta->>'title' as name, 
    pricing,       -- JSONB Pricing structure (where price likely lives)
    config,        -- Variants
    meta           -- Other metadata
FROM products 
WHERE meta->>'title' ILIKE '%Meta001%' OR meta->>'title' ILIKE '%Hardware Wallet%';

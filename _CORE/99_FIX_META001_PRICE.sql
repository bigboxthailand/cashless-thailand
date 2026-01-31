-- [CORE] 99_FIX_META001_PRICE.sql
-- Force update the basePrice in the JSON column to 5550
-- This fixes the issue at the data level immediately.

UPDATE products
SET pricing = jsonb_set(pricing, '{basePrice}', '5550'::jsonb)
WHERE meta->>'title' ILIKE '%Meta001%';

-- Verify
SELECT id, meta->>'title', pricing FROM products WHERE meta->>'title' ILIKE '%Meta001%';

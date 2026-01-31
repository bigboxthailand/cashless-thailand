-- _CORE/73_REFILL_OUT_OF_STOCK_PRODUCTS.sql
-- This script refills stock to 10 for all products that are currently out of stock.

-- 1. Update products with variants
UPDATE products
SET config = jsonb_set(
    config,
    '{variants}',
    (
        SELECT jsonb_agg(
            item || jsonb_build_object('stock', 10)
        )
        FROM jsonb_array_elements(config->'variants') AS item
    )
)
WHERE (config->>'hasVariants')::boolean = true
  AND (
    SELECT COALESCE(SUM((v->>'stock')::int), 0)
    FROM jsonb_array_elements(config->'variants') AS v
  ) <= 0;

-- 2. Update products without variants (Single stock)
UPDATE products
SET config = jsonb_set(
    config,
    '{inventory,stock}',
    '10'::jsonb
)
WHERE (config->>'hasVariants')::boolean = false
  AND (COALESCE((config->'inventory'->>'stock')::int, 0) <= 0);

-- [CORE] 70_FIX_CRYPTOCLOCK_VARIANT_PRICES.sql
-- Fix variant prices for CryptoClock Basic to match the 882 THB sale price

UPDATE products
SET 
    config = jsonb_set(
        config, 
        '{variants}', 
        (
            SELECT jsonb_agg(
                jsonb_set(
                    jsonb_set(v, '{price}', '882'), -- Set Selling Price to 882
                    '{comparePrice}', '980'         -- Set Original Price to 980
                )
            )
            FROM jsonb_array_elements(config->'variants') v
        )
    ),
    pricing = jsonb_set(
        jsonb_set(pricing, '{basePrice}', '882'),
        '{comparePrice}', '980'
    )
WHERE id = 'cryptoclock-basic';

-- Also find all other products that might have this mismatch and fix them if needed
-- For now, focusing on the ones reported.

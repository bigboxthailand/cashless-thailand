-- Check actual DB values for Saving model
SELECT 
    id, 
    pricing->'basePrice' as base_price,
    pricing->'comparePrice' as compare_price,
    config->'variants' as variants
FROM products 
WHERE id = 'cryptoclock-saving';

-- Check reviews and their product_ids
SELECT id, product_id, rating, comment FROM reviews;

-- Check products to see their actual IDs
SELECT id, meta->>'title' as title FROM products;

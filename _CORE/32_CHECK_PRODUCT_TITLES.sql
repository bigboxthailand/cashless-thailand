-- Dump product IDs and Titles to plan manual repair
SELECT id, meta->>'title' as title FROM products;

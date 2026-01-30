-- Repair missing product_ids in order_items
-- Matches order_items.title against products.title (ignoring variant suffixes by matching prefix)

UPDATE order_items
SET product_id = p.id
FROM products p
WHERE order_items.product_id IS NULL
  AND order_items.title ILIKE (p.meta->>'title' || '%');

-- Verify the fix (removed ORDER BY created_at since column doesn't exist)
SELECT product_id, title, price FROM order_items WHERE product_id IS NOT NULL LIMIT 10;

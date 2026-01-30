-- Check order_items columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'order_items';

-- Check data for the specific order shown in screenshot (ORD-202614064) (assuming id is int or uuid, looking for order_id)
-- First find the internal ID of the order if 'ORD-...' is a display ID, or if it's the real ID.
-- Usually 'ORD-...' is generated. Let's list items for recent orders.

SELECT * FROM order_items 
ORDER BY created_at DESC 
LIMIT 5;

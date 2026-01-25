-- List all columns in order_items table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'order_items';

-- View raw data (just 1 row to see column names and value format)
SELECT * FROM order_items LIMIT 1;

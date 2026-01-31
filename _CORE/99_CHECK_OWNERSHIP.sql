-- Check link between User -> Shop -> Products
SELECT 
    u.email,
    u.id as user_id,
    s.name as shop_name,
    s.id as shop_id,
    s.status as shop_status,
    count(p.id) as product_count_in_db
FROM auth.users u
JOIN profiles prof ON prof.id = u.id
JOIN shops s ON s.owner_id = prof.id
LEFT JOIN products p ON p.shop_id = s.id
GROUP BY u.email, u.id, s.name, s.id, s.status;

-- Note: we join auth.users just to get email for easier debugging by human

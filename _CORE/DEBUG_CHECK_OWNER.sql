-- Check shop owner and their profile
SELECT 
    s.id as shop_id,
    s.name as shop_name,
    s.owner_id,
    p.full_name as owner_name,
    p.email as owner_email
FROM shops s
JOIN profiles p ON s.owner_id = p.id
WHERE s.id = 'fac68e93-9a06-4a3e-a43a-1316c5229ec9';

-- Also check if there is ANY profile with the expected name
SELECT * FROM profiles WHERE full_name ILIKE '%Natthapong%';

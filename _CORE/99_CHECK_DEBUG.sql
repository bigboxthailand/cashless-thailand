-- --- CHECK YOUR DATA ---
-- Replace 'YOUR_WALLET_ADDRESS' with your actual wallet address (e.g., 0x123...)
-- run this in Supabase SQL Editor

SELECT 
    p.id as profile_id,
    p.wallet_address,
    p.email,
    s.id as shop_id,
    s.name as shop_name,
    s.status as shop_status,
    s.owner_id as shop_owner_id,
    s.promptpay_id,
    s.lightning_address
FROM profiles p
LEFT JOIN shops s ON s.owner_id = p.id
-- WHERE p.wallet_address = 'YOUR_WALLET_ADDRESS' -- Uncomment and put your wallet here
ORDER BY p.created_at DESC;

-- If you see a profile but `shop_name` is NULL, it means the link is missing or shop wasn't created.
-- If you DON'T see your wallet address in profiles, it means you logged in with a different one or profile creation failed.

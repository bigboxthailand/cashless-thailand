-- Update Store Information with correct data
UPDATE store_settings 
SET 
    store_name = 'Cashless Thailand',
    store_address = '1509 Min Mani 1 Alley, Soi Phetkasem 4, Wat Tha Phra, Bangkok Yai, Bangkok 10700',
    store_phone = '090-987-9566',
    store_email = 'mycryptoclock@gmail.com',
    updated_at = NOW()
WHERE id = 1;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';

-- [CORE] FIX_SLIP_IMAGES.sql
-- อัพเดท slip_image URL ของ Orders ทั้งหมดที่ใช้ via.placeholder.com ให้เป็น placehold.co

UPDATE public.orders
SET slip_image = '/payment_slip.png'
WHERE slip_image LIKE '%via.placeholder.com%'
   OR slip_image LIKE '%placeholder%'
   OR slip_image LIKE '%placehold.co%';

-- Verify
SELECT id, slip_image 
FROM public.orders 
LIMIT 5;

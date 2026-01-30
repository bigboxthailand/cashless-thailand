ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_provider text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_status text DEFAULT 'pending'; -- pending, processing, shipped, delivered, cancelled

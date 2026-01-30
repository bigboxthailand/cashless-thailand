-- Safe Storage Setup
-- 1. Create Bucket "chat-attachments"
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Policies (using DO block to avoid errors if they exist, or just use separate statements that don't fail hard)

-- Policy: Public Read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Read chat-attachments'
  ) THEN
    CREATE POLICY "Public Read chat-attachments"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'chat-attachments' );
  END IF;
END $$;

-- Policy: Authenticated Upload
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated Upload chat-attachments'
  ) THEN
    CREATE POLICY "Authenticated Upload chat-attachments"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK ( bucket_id = 'chat-attachments' );
  END IF;
END $$;

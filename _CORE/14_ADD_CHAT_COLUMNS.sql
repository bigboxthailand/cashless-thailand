-- Add missing columns for Chat Attachments & Metadata

ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS attachment_url TEXT;

ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS metadata JSONB;

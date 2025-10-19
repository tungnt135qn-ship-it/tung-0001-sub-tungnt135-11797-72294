-- Force types regeneration by modifying schema
-- Add a temporary column and remove it
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS temp_refresh_column TEXT;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS temp_refresh_column;
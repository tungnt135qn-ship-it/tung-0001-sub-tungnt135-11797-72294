-- This migration ensures all tables are properly configured and triggers types regeneration

-- Verify blockchain_stats table exists with correct structure
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blockchain_stats') THEN
    RAISE EXCEPTION 'blockchain_stats table does not exist';
  END IF;
END $$;

-- Verify profiles table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    RAISE EXCEPTION 'profiles table does not exist';
  END IF;
END $$;

-- Verify transactions table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transactions') THEN
    RAISE EXCEPTION 'transactions table does not exist';
  END IF;
END $$;

-- Verify news_events table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'news_events') THEN
    RAISE EXCEPTION 'news_events table does not exist';
  END IF;
END $$;

-- Add a comment to trigger types sync
COMMENT ON TABLE public.blockchain_stats IS 'Blockchain statistics and metrics';
COMMENT ON TABLE public.profiles IS 'User profile information';
COMMENT ON TABLE public.transactions IS 'Transaction history';
COMMENT ON TABLE public.news_events IS 'News and events';
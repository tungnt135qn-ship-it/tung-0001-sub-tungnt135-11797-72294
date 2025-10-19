-- Refresh database schema to regenerate TypeScript types
-- Add comments to tables to trigger type regeneration

COMMENT ON TABLE public.blockchain_stats IS 'Stores blockchain statistics and metrics';
COMMENT ON TABLE public.profiles IS 'User profile information';
COMMENT ON TABLE public.transactions IS 'User transaction history';
COMMENT ON TABLE public.news_events IS 'News and events information';

-- Ensure all tables have RLS enabled
ALTER TABLE public.blockchain_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_events ENABLE ROW LEVEL SECURITY;
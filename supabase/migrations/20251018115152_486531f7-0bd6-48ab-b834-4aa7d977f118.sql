-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  avatar_url text,
  can_balance decimal(20, 2) DEFAULT 0 NOT NULL,
  total_invested decimal(20, 2) DEFAULT 0,
  membership_tier text DEFAULT 'bronze',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create blockchain stats table
CREATE TABLE public.blockchain_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_can_supply decimal(20, 2) NOT NULL,
  circulating_supply decimal(20, 2) NOT NULL,
  total_holders integer DEFAULT 0,
  total_transactions bigint DEFAULT 0,
  current_phase integer DEFAULT 1,
  total_value_locked decimal(20, 2) DEFAULT 0,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS for blockchain_stats (public readable)
ALTER TABLE public.blockchain_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blockchain stats"
  ON public.blockchain_stats FOR SELECT
  USING (true);

-- Create news and events table
CREATE TABLE public.news_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  event_type text NOT NULL CHECK (event_type IN ('news', 'event', 'announcement')),
  event_date timestamptz,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS for news_events (public readable)
ALTER TABLE public.news_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news and events"
  ON public.news_events FOR SELECT
  USING (true);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, can_balance)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    1000.00
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert initial blockchain stats
INSERT INTO public.blockchain_stats (
  total_can_supply,
  circulating_supply,
  total_holders,
  total_transactions,
  current_phase,
  total_value_locked
) VALUES (
  1000000000.00,
  250000000.00,
  15847,
  2341567,
  2,
  45000000.00
);

-- Insert sample news and events
INSERT INTO public.news_events (title, description, event_type, event_date, is_featured) VALUES
('CAN Token Listed on Major Exchange', 'CAN token is now available for trading on Binance with USDT pair', 'news', now(), true),
('Phase 3 Investment Opens Next Month', 'Get ready for Phase 3 with exclusive early bird bonuses', 'announcement', now() + interval '30 days', true),
('Community AMA Session', 'Join our monthly AMA with the core team to discuss roadmap and updates', 'event', now() + interval '7 days', false),
('New NFT Collection Launch', 'Exclusive Genesis NFT collection dropping with special utilities', 'news', now() - interval '2 days', false);
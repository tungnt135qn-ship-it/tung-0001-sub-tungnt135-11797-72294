-- Create staking_coin table for CAN token staking
CREATE TABLE public.staking_coin (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_staked NUMERIC NOT NULL DEFAULT 0,
  rewards NUMERIC NOT NULL DEFAULT 0,
  apy NUMERIC NOT NULL DEFAULT 10.0,
  staked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  locked_until TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staking_nft table for NFT staking
CREATE TABLE public.staking_nft (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nft_id TEXT NOT NULL,
  nft_name TEXT NOT NULL,
  nft_value NUMERIC NOT NULL DEFAULT 0,
  rewards NUMERIC NOT NULL DEFAULT 0,
  apy NUMERIC NOT NULL DEFAULT 15.0,
  staked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  locked_until TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.staking_coin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staking_nft ENABLE ROW LEVEL SECURITY;

-- Create policies for staking_coin
CREATE POLICY "Users can view their own coin stakes"
ON public.staking_coin
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own coin stakes"
ON public.staking_coin
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coin stakes"
ON public.staking_coin
FOR UPDATE
USING (auth.uid() = user_id);

-- Create policies for staking_nft
CREATE POLICY "Users can view their own NFT stakes"
ON public.staking_nft
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own NFT stakes"
ON public.staking_nft
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own NFT stakes"
ON public.staking_nft
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_staking_coin_updated_at
BEFORE UPDATE ON public.staking_coin
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staking_nft_updated_at
BEFORE UPDATE ON public.staking_nft
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
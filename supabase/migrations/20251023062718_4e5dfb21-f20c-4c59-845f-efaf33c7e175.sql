-- Update news_events table to support different types and event features
ALTER TABLE public.news_events 
ADD COLUMN location TEXT,
ADD COLUMN latitude NUMERIC,
ADD COLUMN longitude NUMERIC,
ADD COLUMN zoom_link TEXT,
ADD COLUMN start_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN end_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN max_attendees INTEGER,
ADD COLUMN content TEXT;

-- Create event_registrations table
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.news_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'registered',
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_registrations
CREATE POLICY "Users can view their own registrations"
ON public.event_registrations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events"
ON public.event_registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own registrations"
ON public.event_registrations
FOR DELETE
USING (auth.uid() = user_id);

-- Allow anyone to count registrations for an event
CREATE POLICY "Anyone can count event registrations"
ON public.event_registrations
FOR SELECT
USING (true);
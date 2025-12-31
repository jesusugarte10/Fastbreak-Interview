-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create venues table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  description TEXT,
  location TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT,
  parent_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event_venues join table
CREATE TABLE IF NOT EXISTS event_venues (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, venue_id)
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_venues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
-- Users can select their own events
CREATE POLICY "Users can select their own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own events
CREATE POLICY "Users can insert their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own events
CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own events
CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for venues
-- Authenticated users can select all venues
CREATE POLICY "Authenticated users can select venues"
  ON venues FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert venues
CREATE POLICY "Authenticated users can insert venues"
  ON venues FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for event_venues
-- Users can manage event_venues for their own events
CREATE POLICY "Users can select event_venues for their events"
  ON event_venues FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_venues.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Users can insert event_venues for their own events
CREATE POLICY "Users can insert event_venues for their events"
  ON event_venues FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_venues.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Users can delete event_venues for their own events
CREATE POLICY "Users can delete event_venues for their events"
  ON event_venues FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_venues.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_starts_at ON events(starts_at);
CREATE INDEX IF NOT EXISTS idx_events_sport ON events(sport);
CREATE INDEX IF NOT EXISTS idx_events_name ON events USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_event_venues_event_id ON event_venues(event_id);
CREATE INDEX IF NOT EXISTS idx_event_venues_venue_id ON event_venues(venue_id);


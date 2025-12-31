-- Migration: Add recurrence support to events table
-- Run this if you already have the events table created

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS recurrence_pattern TEXT,
ADD COLUMN IF NOT EXISTS parent_event_id UUID REFERENCES events(id) ON DELETE CASCADE;


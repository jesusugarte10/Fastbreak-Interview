-- Migration: Add location column to events table
-- Run this if you already have the events table created

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS location TEXT;


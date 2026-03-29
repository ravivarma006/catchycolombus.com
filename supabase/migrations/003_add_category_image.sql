-- ============================================================
-- Add image_url column to service_categories table
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================
ALTER TABLE service_categories
  ADD COLUMN IF NOT EXISTS image_url TEXT;

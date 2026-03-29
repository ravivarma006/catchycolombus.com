-- ============================================================
-- Catch Columbus — Hero Slides + Stats Tables
-- ============================================================

-- 1. HERO SLIDES
CREATE TABLE IF NOT EXISTS hero_slides (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url     TEXT NOT NULL,
  thumb_url     TEXT NOT NULL,
  location      TEXT NOT NULL,
  tag           TEXT NOT NULL,
  headline      TEXT[] NOT NULL,
  subtitle      TEXT NOT NULL,
  overlay_from  TEXT NOT NULL DEFAULT 'rgba(0,20,50,0.48)',
  overlay_to    TEXT NOT NULL DEFAULT 'rgba(0,20,50,0.50)',
  is_active     BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active hero slides"
  ON hero_slides FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage hero slides"
  ON hero_slides FOR ALL
  USING (get_user_role() = 'admin');

-- 2. HERO STATS
CREATE TABLE IF NOT EXISTS hero_stats (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value         TEXT NOT NULL,
  label         TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active hero stats"
  ON hero_stats FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage hero stats"
  ON hero_stats FOR ALL
  USING (get_user_role() = 'admin');

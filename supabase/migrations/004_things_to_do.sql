-- ============================================================
-- Catch Columbus — Things to Do Module
-- Tables + Indexes
-- ============================================================

-- ─────────────────────────────────────────
-- ACTIVITY CATEGORIES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  icon          TEXT,
  description   TEXT,
  image_url     TEXT,
  display_order INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- ACTIVITIES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID REFERENCES activity_categories(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  address       TEXT,
  neighborhood  TEXT,
  phone         TEXT,
  email         TEXT,
  website       TEXT,
  image_url     TEXT,
  hours         TEXT,
  price_range   TEXT,
  is_featured   BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  social_links  JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category_id);
CREATE INDEX IF NOT EXISTS idx_activities_active ON activities(is_active);
CREATE INDEX IF NOT EXISTS idx_activities_featured ON activities(is_featured);
CREATE INDEX IF NOT EXISTS idx_activity_categories_active ON activity_categories(is_active);

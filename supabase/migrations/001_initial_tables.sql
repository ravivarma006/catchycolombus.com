-- ============================================================
-- Catch Columbus — Initial Tables Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─────────────────────────────────────────
-- 1. PROFILES (linked to Supabase Auth)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'visitor'
                CHECK (role IN ('visitor', 'business_user', 'admin')),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'visitor'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ─────────────────────────────────────────
-- 2. SERVICE CATEGORIES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  icon          TEXT,               -- emoji or icon name
  description   TEXT,
  display_order INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 3. SERVICE PROVIDERS (approved listings)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_providers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  phone         TEXT,
  email         TEXT,
  address       TEXT,
  description   TEXT,
  website       TEXT,
  image_url     TEXT,
  social_links  JSONB DEFAULT '{}',  -- {facebook, instagram, linkedin}
  is_active     BOOLEAN DEFAULT true,
  approved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 4. PROVIDER REQUESTS (business submissions)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS provider_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  business_name   TEXT NOT NULL,
  business_type   TEXT,
  category_id     UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  phone           TEXT,
  email           TEXT NOT NULL,
  address         TEXT,
  description     TEXT,
  website         TEXT,
  image_url       TEXT,
  social_links    JSONB DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected','needs_changes')),
  admin_notes     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 5. EVENTS (approved city events)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  event_date    DATE NOT NULL,
  event_time    TIME,
  location      TEXT,
  description   TEXT,
  image_url     TEXT,
  price         TEXT DEFAULT 'Free',
  website       TEXT,
  category      TEXT,              -- e.g. 'kids', 'spring', 'fall', 'free', 'attraction'
  is_featured   BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 6. EVENT REQUESTS (business submissions)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name    TEXT NOT NULL,
  phone         TEXT,
  email         TEXT NOT NULL,
  address       TEXT,
  description   TEXT,
  event_date    DATE,
  event_time    TIME,
  price         TEXT DEFAULT 'Free',
  website       TEXT,
  image_url     TEXT,
  social_links  JSONB DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','rejected','needs_changes')),
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 7. COUPON CATEGORIES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupon_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  display_order INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true
);


-- ─────────────────────────────────────────
-- 8. COUPONS (approved coupon listings)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id           UUID REFERENCES coupon_categories(id) ON DELETE SET NULL,
  product_service_name  TEXT NOT NULL,
  phone                 TEXT,
  email                 TEXT,
  address               TEXT,
  description           TEXT,
  coupon_code           TEXT,     -- code or 'Mention Catch Columbus'
  website               TEXT,
  image_url             TEXT,
  social_links          JSONB DEFAULT '{}',
  is_active             BOOLEAN DEFAULT true,
  approved_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 9. COUPON REQUESTS (business submissions)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupon_requests (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_service_name  TEXT NOT NULL,
  category_id           UUID REFERENCES coupon_categories(id) ON DELETE SET NULL,
  phone                 TEXT,
  email                 TEXT NOT NULL,
  address               TEXT,
  description           TEXT,
  coupon_code           TEXT,
  website               TEXT,
  image_url             TEXT,
  social_links          JSONB DEFAULT '{}',
  status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','approved','rejected','needs_changes')),
  admin_notes           TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 10. ANNOUNCEMENTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  content       TEXT,
  image_url     TEXT,
  is_pinned     BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  published_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 11. SUBSCRIBERS (newsletter)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  is_active       BOOLEAN DEFAULT true,
  subscribed_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 12. BANNERS (site-wide banners managed by admin)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS banners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT,
  image_url       TEXT NOT NULL,
  link_url        TEXT,
  is_active       BOOLEAN DEFAULT true,
  display_order   INT DEFAULT 0,
  start_date      DATE,
  end_date        DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- 13. PAGES (CMS for About, etc.)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pages (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT NOT NULL UNIQUE,
  title               TEXT NOT NULL,
  content             JSONB DEFAULT '{}',
  meta_description    TEXT,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_service_providers_category ON service_providers(category_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_active   ON service_providers(is_active);
CREATE INDEX IF NOT EXISTS idx_provider_requests_user     ON provider_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_requests_status   ON provider_requests(status);
CREATE INDEX IF NOT EXISTS idx_events_date                ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_active              ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_event_requests_user        ON event_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_event_requests_status      ON event_requests(status);
CREATE INDEX IF NOT EXISTS idx_coupons_category           ON coupons(category_id);
CREATE INDEX IF NOT EXISTS idx_coupons_active             ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupon_requests_user       ON coupon_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_requests_status     ON coupon_requests(status);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned       ON announcements(is_pinned);
CREATE INDEX IF NOT EXISTS idx_banners_active             ON banners(is_active);

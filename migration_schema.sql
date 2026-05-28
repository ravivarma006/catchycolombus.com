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
-- ============================================================
-- Catch Columbus — Row Level Security Policies
-- Run this AFTER 001_initial_tables.sql
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ─────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- SERVICE CATEGORIES (public read)
-- ─────────────────────────────────────────
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
  ON service_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage categories"
  ON service_categories FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- SERVICE PROVIDERS (public read of approved)
-- ─────────────────────────────────────────
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active providers"
  ON service_providers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage providers"
  ON service_providers FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- PROVIDER REQUESTS
-- ─────────────────────────────────────────
ALTER TABLE provider_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business users can insert own requests"
  ON provider_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND get_user_role() IN ('business_user', 'admin')
  );

CREATE POLICY "Users can view own requests"
  ON provider_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own pending requests"
  ON provider_requests FOR UPDATE
  USING (
    auth.uid() = user_id
    AND status IN ('pending', 'needs_changes')
  );

CREATE POLICY "Admin can manage all provider requests"
  ON provider_requests FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- EVENTS (public read of active)
-- ─────────────────────────────────────────
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active events"
  ON events FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage events"
  ON events FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- EVENT REQUESTS
-- ─────────────────────────────────────────
ALTER TABLE event_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business users can insert own event requests"
  ON event_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND get_user_role() IN ('business_user', 'admin')
  );

CREATE POLICY "Users can view own event requests"
  ON event_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own pending event requests"
  ON event_requests FOR UPDATE
  USING (
    auth.uid() = user_id
    AND status IN ('pending', 'needs_changes')
  );

CREATE POLICY "Admin can manage all event requests"
  ON event_requests FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- COUPON CATEGORIES (public read)
-- ─────────────────────────────────────────
ALTER TABLE coupon_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupon categories"
  ON coupon_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage coupon categories"
  ON coupon_categories FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- COUPONS (public read of active)
-- ─────────────────────────────────────────
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage coupons"
  ON coupons FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- COUPON REQUESTS
-- ─────────────────────────────────────────
ALTER TABLE coupon_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business users can insert own coupon requests"
  ON coupon_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND get_user_role() IN ('business_user', 'admin')
  );

CREATE POLICY "Users can view own coupon requests"
  ON coupon_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own pending coupon requests"
  ON coupon_requests FOR UPDATE
  USING (
    auth.uid() = user_id
    AND status IN ('pending', 'needs_changes')
  );

CREATE POLICY "Admin can manage all coupon requests"
  ON coupon_requests FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- ANNOUNCEMENTS (public read of active)
-- ─────────────────────────────────────────
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active announcements"
  ON announcements FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage announcements"
  ON announcements FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- SUBSCRIBERS
-- ─────────────────────────────────────────
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can view all subscribers"
  ON subscribers FOR SELECT
  USING (get_user_role() = 'admin');

CREATE POLICY "Admin can manage subscribers"
  ON subscribers FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- BANNERS (public read of active)
-- ─────────────────────────────────────────
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  USING (
    is_active = true
    AND (start_date IS NULL OR start_date <= CURRENT_DATE)
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
  );

CREATE POLICY "Admin can manage banners"
  ON banners FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- PAGES (public read)
-- ─────────────────────────────────────────
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pages"
  ON pages FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage pages"
  ON pages FOR ALL
  USING (get_user_role() = 'admin');
-- ============================================================
-- Add image_url column to service_categories table
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================
ALTER TABLE service_categories
  ADD COLUMN IF NOT EXISTS image_url TEXT;
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
-- ============================================================
-- Catch Columbus — Things to Do RLS Policies
-- ============================================================

-- ─────────────────────────────────────────
-- ACTIVITY CATEGORIES
-- ─────────────────────────────────────────
ALTER TABLE activity_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active activity categories"
  ON activity_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage activity categories"
  ON activity_categories FOR ALL
  USING (get_user_role() = 'admin');

-- ─────────────────────────────────────────
-- ACTIVITIES
-- ─────────────────────────────────────────
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active activities"
  ON activities FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage activities"
  ON activities FOR ALL
  USING (get_user_role() = 'admin');
-- ============================================================
-- Catch Columbus — Things to Do Seed Data
-- Real Columbus, Ohio attractions & activities
-- ============================================================

-- ─────────────────────────────────────────
-- ACTIVITY CATEGORIES
-- ─────────────────────────────────────────
INSERT INTO activity_categories (name, slug, icon, description, display_order) VALUES
  ('Attractions',         'attractions',         '🎡', 'Must-see attractions and iconic landmarks in Columbus',    1),
  ('Museums',             'museums',             '🏛️', 'World-class museums, galleries, and cultural institutions', 2),
  ('Parks & Nature',      'parks-nature',        '🌳', 'Beautiful parks, trails, and outdoor green spaces',         3),
  ('Shopping',            'shopping',            '🛍️', 'Shopping districts, malls, and unique local boutiques',     4),
  ('Nightlife',           'nightlife',           '🌃', 'Bars, clubs, live music, and late-night entertainment',     5),
  ('Tours',               'tours',               '🗺️', 'Guided tours, food walks, and unique experiences',          6),
  ('Sports',              'sports',              '🏟️', 'Professional and collegiate sports venues and events',      7),
  ('Outdoor Adventures',  'outdoor-adventures',  '🚴', 'Hiking, biking, kayaking, and outdoor recreation',          8)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Attractions
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'attractions'),
    'Columbus Zoo and Aquarium',
    'columbus-zoo-and-aquarium',
    'One of the top-rated zoos in the nation featuring over 10,000 animals across multiple regions and habitats. Home to the famous Jack Hanna legacy, the zoo offers thrilling rides at Zoombezi Bay water park, seasonal light shows, and conservation programs that protect wildlife worldwide.',
    '4850 W Powell Rd, Powell, OH 43065',
    'Powell',
    'https://www.columbuszoo.org',
    '$$',
    'Daily 9:00 AM – 5:00 PM (seasonal hours vary)',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'attractions'),
    'COSI - Center of Science and Industry',
    'cosi-center-of-science-and-industry',
    'Award-winning science center ranked among the best in the nation. Features interactive exhibits on space, energy, life sciences, and more. Includes a planetarium, giant screen theater, outdoor science park, and engaging programs for all ages.',
    '333 W Broad St, Columbus, OH 43215',
    'Downtown',
    'https://cosi.org',
    '$$',
    'Wed–Sun 10:00 AM – 5:00 PM',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'attractions'),
    'Franklin Park Conservatory and Botanical Gardens',
    'franklin-park-conservatory',
    'A stunning botanical garden and conservatory featuring exotic plant collections from around the world, breathtaking Chihuly glass art installations, seasonal light shows, and community gardens. A perfect blend of art, nature, and education.',
    '1777 E Broad St, Columbus, OH 43203',
    'East Side',
    'https://www.fpconservatory.org',
    '$$',
    'Daily 10:00 AM – 5:00 PM',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Museums
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'museums'),
    'Columbus Museum of Art',
    'columbus-museum-of-art',
    'A premier fine art museum with collections spanning European and American art from 1850 to today. The innovative Wonder Room encourages creativity for visitors of all ages. Features rotating exhibitions, sculpture garden, and community events.',
    '480 E Broad St, Columbus, OH 43215',
    'Downtown',
    'https://www.columbusmuseum.org',
    '$',
    'Tue–Sun 10:00 AM – 5:00 PM, Thu until 9:00 PM',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'museums'),
    'National Veterans Memorial and Museum',
    'national-veterans-memorial-and-museum',
    'The only museum in America honoring all branches of the US armed forces through powerful, immersive exhibits and personal narratives. The striking architecture sits along the Scioto River with panoramic downtown views.',
    '300 W Broad St, Columbus, OH 43215',
    'Downtown',
    'https://www.nationalvmm.org',
    '$$',
    'Wed–Sun 10:00 AM – 5:00 PM',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Parks & Nature
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'parks-nature'),
    'Scioto Mile and Scioto Audubon Metro Park',
    'scioto-mile',
    'A stunning urban riverfront park along the Scioto River in downtown Columbus. Features interactive fountains, paved trails, the Scioto Greenways, and breathtaking skyline views. The adjacent Scioto Audubon park adds climbing walls, wetlands, and birding trails.',
    'W Broad St & Civic Center Dr, Columbus, OH 43215',
    'Downtown',
    'https://www.sciotomile.com',
    'Free',
    'Open daily, dawn to dusk',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'parks-nature'),
    'Highbanks Metro Park',
    'highbanks-metro-park',
    'Over 1,100 acres of forests, prairies, wetlands, and scenic bluffs along the Olentangy River. Offers extensive hiking and mountain biking trails, nature center, sledding hills, and Native American earthworks. A favorite for trail running and wildlife watching.',
    '9466 Columbus Pike, Lewis Center, OH 43035',
    'Lewis Center',
    'https://www.metroparks.net/parks-trails/highbanks',
    'Free',
    'Open daily 6:30 AM – 10:00 PM',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Shopping
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'shopping'),
    'Easton Town Center',
    'easton-town-center',
    'Columbus''s premier open-air lifestyle center with over 200 stores, restaurants, and entertainment venues. From luxury brands to popular retailers, plus a movie theater, comedy club, and seasonal events that make it a year-round destination.',
    '160 Easton Town Center, Columbus, OH 43219',
    'Easton',
    'https://www.eastontowncenter.com',
    'Free',
    'Mon–Sat 10:00 AM – 9:00 PM, Sun 11:00 AM – 6:00 PM',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'shopping'),
    'Short North Arts District',
    'short-north-arts-district',
    'One of Columbus''s most vibrant neighborhoods, known for its eclectic galleries, independent boutiques, chef-driven restaurants, and the famous monthly Gallery Hop. The arches over High Street are an iconic Columbus landmark.',
    'N High St, Columbus, OH 43215',
    'Short North',
    'https://www.shortnorth.com',
    'Free',
    'Varies by shop — most open 10 AM – 8 PM',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Nightlife
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'nightlife'),
    'Arena District',
    'arena-district',
    'Columbus''s premier entertainment hub centered around Nationwide Arena. Packed with sports bars, craft cocktail lounges, live music venues, and rooftop patios. The energy here peaks on game nights and weekends.',
    'Arena District, Columbus, OH 43215',
    'Arena District',
    'https://www.arenadistrict.com',
    '$–$$$',
    'Varies by venue — most open until 2 AM',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Sports
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'sports'),
    'Ohio Stadium — The Horseshoe',
    'ohio-stadium',
    'The legendary Horseshoe, home to Ohio State Buckeyes football. With over 100,000 seats, it''s one of the largest stadiums in the nation. Game days transform Columbus into a sea of scarlet and gray with unmatched energy and tradition.',
    '411 Woody Hayes Dr, Columbus, OH 43210',
    'University District',
    'https://ohiostatebuckeyes.com/venues/ohio-stadium/',
    '$$$',
    'Event days only — gates open 2 hours before kickoff',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'sports'),
    'Lower.com Field',
    'lower-com-field',
    'State-of-the-art home of the Columbus Crew, 2023 MLS Cup champions. Located in the Arena District, the stadium delivers an electric atmosphere for soccer fans with stunning downtown views and a thriving tailgate scene.',
    '96 Columbus Crew Way, Columbus, OH 43215',
    'Arena District',
    'https://www.columbuscrew.com',
    '$$',
    'Match days and event days',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Tours
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'tours'),
    'Columbus Food Adventures',
    'columbus-food-adventures',
    'Walking food tours that take you behind the scenes of Columbus''s diverse culinary scene. Explore neighborhoods like the Short North, North Market, and more while sampling dishes from chef-owned restaurants and hidden gems.',
    'Various locations, Columbus, OH',
    'Various',
    'https://www.columbusfoodadventures.com',
    '$$',
    'Tours run Sat & Sun — check website for schedule',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Outdoor Adventures
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'outdoor-adventures'),
    'Olentangy Trail',
    'olentangy-trail',
    'A scenic 13.5-mile paved multi-use trail following the Olentangy River through the heart of Columbus. Perfect for biking, running, and walking, the trail connects parks, neighborhoods, and the Ohio State campus with beautiful river views.',
    'Olentangy River Rd, Columbus, OH',
    'Various',
    'https://www.metroparks.net/parks-trails/greenways/olentangy-trail/',
    'Free',
    'Open daily, dawn to dusk',
    false
  )
ON CONFLICT (slug) DO NOTHING;
-- ============================================================
-- Catch Columbus — Default Admin User Seed
-- Creates admin@columbus.com with password: marketplace
-- ============================================================

-- Step 1: Create auth user
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'ad78cc7e-37fa-4eea-83fd-50d972478222',
  'authenticated', 'authenticated',
  'admin@columbus.com',
  crypt('marketplace', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin"}',
  NOW(), NOW(),
  '', '', '', ''
);

-- Step 2: Create identity (required for email/password login)
INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) VALUES (
  'ad78cc7e-37fa-4eea-83fd-50d972478222',
  'ad78cc7e-37fa-4eea-83fd-50d972478222',
  'admin@columbus.com',
  jsonb_build_object(
    'sub', 'ad78cc7e-37fa-4eea-83fd-50d972478222',
    'email', 'admin@columbus.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  NOW(), NOW(), NOW()
);

-- Step 3: Set profile role to admin
INSERT INTO profiles (id, email, role)
VALUES ('ad78cc7e-37fa-4eea-83fd-50d972478222', 'admin@columbus.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
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
-- ============================================================
-- Seed: Hero Slides + Stats (matches original hardcoded data)
-- ============================================================

INSERT INTO hero_slides (image_url, thumb_url, location, tag, headline, subtitle, overlay_from, overlay_to, is_active, display_order) VALUES
(
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=70&auto=format&fit=crop',
  'Downtown Columbus',
  'City Skyline',
  ARRAY['Discover', 'the Heart of', 'Columbus'],
  'Events, services, and hidden gems in the city you love.',
  'rgba(0,20,50,0.48)',
  'rgba(0,20,50,0.50)',
  true, 0
),
(
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=70&auto=format&fit=crop',
  'Short North',
  'Arts & Culture',
  ARRAY['Arts, Culture', '& Vibrant', 'Nightlife'],
  'Columbus''s most electrifying arts district — galleries, food, and music.',
  'rgba(10,8,30,0.48)',
  'rgba(10,8,30,0.50)',
  true, 1
),
(
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&q=70&auto=format&fit=crop',
  'Ohio State University',
  'Campus Life',
  ARRAY['Pride of the', 'Buckeye', 'State'],
  'Campus energy meets city culture — sports, traditions, and innovation.',
  'rgba(12,0,0,0.48)',
  'rgba(12,0,0,0.50)',
  true, 2
),
(
  'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=1800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400&q=70&auto=format&fit=crop',
  'Scioto Mile',
  'Outdoors',
  ARRAY['Nature', 'Meets the', 'City'],
  'World-class parks and waterways woven into the heart of downtown.',
  'rgba(0,16,10,0.48)',
  'rgba(0,16,10,0.50)',
  true, 3
);

INSERT INTO hero_stats (value, label, display_order, is_active) VALUES
('900K+',  'Residents',        0, true),
('200+',   'Events / Year',    1, true),
('50+',    'Neighbourhoods',   2, true),
('#1',     'Fastest Growing',  3, true);
-- Add expiration and enhanced fields to coupons table
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS expires_at DATE;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'percentage';
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_value NUMERIC(10,2);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_redemptions INT;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS current_redemptions INT DEFAULT 0;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS terms_conditions TEXT;
-- Subscription plans (managed by admin)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,                -- 'Free', 'Insider', 'VIP', 'Business'
  slug          TEXT NOT NULL UNIQUE,         -- 'free', 'insider', 'vip', 'business'
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_yearly  NUMERIC(10,2),
  description   TEXT,
  features      TEXT[] DEFAULT '{}',          -- bullet-point feature list
  is_featured   BOOLEAN DEFAULT false,        -- highlight this plan on pricing page
  is_active     BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id           UUID NOT NULL REFERENCES subscription_plans(id),
  status            TEXT NOT NULL DEFAULT 'active',  -- active, cancelled, expired, trialing
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT,
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can read active plans
CREATE POLICY "plans_public_read" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- Admins can manage plans
CREATE POLICY "plans_admin_all" ON subscription_plans
  FOR ALL USING (get_user_role() = 'admin');

-- Users can read their own subscriptions
CREATE POLICY "subscriptions_own_read" ON user_subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Admins can read all subscriptions
CREATE POLICY "subscriptions_admin_read" ON user_subscriptions
  FOR ALL USING (get_user_role() = 'admin');

-- Seed default plans
INSERT INTO subscription_plans (name, slug, price_monthly, price_yearly, description, features, is_featured, display_order) VALUES
(
  'Free', 'free', 0, 0,
  'Get started with the basics',
  ARRAY['Browse all events & listings', 'View coupons', 'Basic search'],
  false, 1
),
(
  'Insider', 'insider', 4.99, 49.99,
  'Unlock exclusive Columbus deals',
  ARRAY['Everything in Free', 'Exclusive member coupons', 'Early event access', 'Email deal alerts'],
  false, 2
),
(
  'VIP', 'vip', 9.99, 99.99,
  'The full Columbus experience',
  ARRAY['Everything in Insider', 'Premium deal alerts', 'Priority customer support', 'Featured business discounts', 'Monthly Columbus guide'],
  true, 3
),
(
  'Business', 'business', 14.99, 149.99,
  'For local businesses to reach Columbus',
  ARRAY['Everything in VIP', 'List your business', 'Submit unlimited coupons', 'Analytics dashboard', 'Featured placement'],
  false, 4
)
ON CONFLICT (slug) DO NOTHING;
-- Monetization and Scale Migrations (Columbus Hyper-Local)

-- 1. Updates to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier UUID REFERENCES subscription_plans(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Create an index to quickly lookup users by referral code
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- 2. Updates to coupons table (is_premium already added in 010_coupon_expiration.sql)
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES profiles(id);

-- Create an index for premium filtering
CREATE INDEX IF NOT EXISTS idx_coupons_is_premium ON coupons(is_premium);

-- 3. New referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, rewarded
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- ensure a user cannot refer the same person twice
  UNIQUE(referrer_id, referred_user_id)
);

-- RLS Policies for Referrals
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referrals_admin_all" ON referrals
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "referrals_read_own" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);
-- Admin audit log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'audit_log_admin_all') THEN
    CREATE POLICY audit_log_admin_all ON admin_audit_log
      FOR ALL USING (get_user_role() = 'admin');
  END IF;
END $$;

-- UNIQUE constraints on slugs to prevent race conditions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'events_slug_unique') THEN
    ALTER TABLE events ADD CONSTRAINT events_slug_unique UNIQUE (slug);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'providers_slug_unique') THEN
    ALTER TABLE service_providers ADD CONSTRAINT providers_slug_unique UNIQUE (slug);
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;
-- Fix: handle_new_user trigger was failing with
--   "relation \"profiles\" does not exist"
-- because SECURITY DEFINER functions run with a restricted search_path.
-- Also makes the function resilient so a hiccup here can never block
-- Supabase auth signup itself.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'visitor'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;
-- Business users need to upload logos/photos for their provider, event,
-- and coupon submissions. Previously only 'admin' could write to storage,
-- which caused "new row violates row-level security policy" on the
-- business submission forms.

-- Allow INSERT for business_user & admin on the 3 submission buckets
CREATE POLICY "Business users can upload provider images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'provider-images'
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

CREATE POLICY "Business users can upload event images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'event-images'
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

CREATE POLICY "Business users can upload coupon images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'coupon-images'
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

-- Allow users to UPDATE/DELETE their own uploads in those buckets
CREATE POLICY "Business users can update own uploads"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id IN ('provider-images','event-images','coupon-images')
  AND owner = auth.uid()
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

CREATE POLICY "Business users can delete own uploads"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id IN ('provider-images','event-images','coupon-images')
  AND owner = auth.uid()
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);
-- Business users should ONLY be able to submit their own business listing.
-- Events and coupons are admin-only. Remove business_user access at every
-- layer where it was previously granted.

-- 1. Storage: drop the event-images & coupon-images INSERT policies
DROP POLICY IF EXISTS "Business users can upload event images"  ON storage.objects;
DROP POLICY IF EXISTS "Business users can upload coupon images" ON storage.objects;

-- 2. Storage: narrow update/delete policies to provider-images only
DROP POLICY IF EXISTS "Business users can update own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Business users can delete own uploads" ON storage.objects;

CREATE POLICY "Business users can update own provider uploads"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'provider-images'
  AND owner = auth.uid()
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

CREATE POLICY "Business users can delete own provider uploads"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'provider-images'
  AND owner = auth.uid()
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

-- 3. Table RLS: drop business_user INSERT on event_requests & coupon_requests
DROP POLICY IF EXISTS "Business users can insert own event requests"  ON public.event_requests;
DROP POLICY IF EXISTS "Business users can insert own coupon requests" ON public.coupon_requests;
-- Give provider_requests proper columns for neighborhood and hours.
-- Previously these were stuffed into admin_notes (which is also used
-- by admins to leave feedback), so admin feedback would overwrite the
-- business owner's data. Moving them to dedicated columns.

ALTER TABLE public.provider_requests
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS hours        text;

-- Best-effort backfill: parse "Neighborhood: X | Hours: Y" out of
-- admin_notes for rows that clearly look like the old synthetic payload.
UPDATE public.provider_requests
SET
  neighborhood = COALESCE(
    neighborhood,
    NULLIF(substring(admin_notes FROM 'Neighborhood:\s*([^|]+?)(?:\s*\||$)'), '')
  ),
  hours = COALESCE(
    hours,
    NULLIF(substring(admin_notes FROM 'Hours:\s*(.+?)$'), '')
  ),
  admin_notes = CASE
    WHEN admin_notes ~ '^(Neighborhood:[^|]*)?(\s*\|\s*Hours:.*)?$' THEN NULL
    ELSE admin_notes
  END
WHERE admin_notes ILIKE 'Neighborhood:%' OR admin_notes ILIKE '%| Hours:%';
-- Approve-provider flow and the business-user dashboard both reference
-- service_providers.user_id, but the column never existed -- every approve
-- was failing with "column user_id does not exist". Add it (nullable, FK to
-- auth.users with ON DELETE SET NULL so deleting an owner doesn't wipe out
-- the public listing). Also add updated_at so future edit flows have it.

ALTER TABLE public.service_providers
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_service_providers_user_id
  ON public.service_providers(user_id);

-- Backfill: for already-approved providers, try to recover the owner from
-- the matching provider_requests row (same business name, approved status).
UPDATE public.service_providers sp
SET user_id = pr.user_id
FROM public.provider_requests pr
WHERE sp.user_id IS NULL
  AND pr.status = 'approved'
  AND lower(trim(pr.business_name)) = lower(trim(sp.name));
-- Hero settings: controls whether hero shows image slides or a background video
create table if not exists public.hero_settings (
  id            integer primary key default 1 check (id = 1), -- single-row table
  hero_mode     text not null default 'slides' check (hero_mode in ('slides', 'video')),
  video_url     text,
  video_thumb_url text,
  updated_at    timestamptz not null default now()
);

-- Seed the single settings row
insert into public.hero_settings (id, hero_mode)
values (1, 'slides')
on conflict (id) do nothing;

-- RLS
alter table public.hero_settings enable row level security;

-- Public can read (needed for SSR home page with anon key)
create policy "hero_settings_public_read"
  on public.hero_settings for select
  using (true);

-- Only service-role / admin can update
create policy "hero_settings_admin_update"
  on public.hero_settings for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
-- Site-wide brand settings — single-row table
create table if not exists public.site_settings (
  id            integer primary key default 1 check (id = 1),
  primary_color text not null default '#0F4C5C',
  accent_color  text not null default '#F5A800',
  updated_at    timestamptz not null default now()
);

insert into public.site_settings (id, primary_color, accent_color)
values (1, '#0F4C5C', '#F5A800')
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

create policy "site_settings_admin_update"
  on public.site_settings for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

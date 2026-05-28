-- ============================================================
-- Catch Columbus — COMPLETE Client Setup
-- Creates missing tables, ALL RLS policies, and admin user
-- Run in: Client's Supabase → SQL Editor → New Query → Run
-- ============================================================


-- ═══════════════════════════════════════════════════════════
-- PART A: CREATE MISSING TABLES (IF NOT EXISTS = safe to re-run)
-- ═══════════════════════════════════════════════════════════

-- A1. Hero Slides
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

-- A2. Hero Stats
CREATE TABLE IF NOT EXISTS hero_stats (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  value         TEXT NOT NULL,
  label         TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- A3. Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  price_monthly NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_yearly  NUMERIC(10,2),
  description   TEXT,
  features      TEXT[] DEFAULT '{}',
  is_featured   BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- A4. User Subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id           UUID NOT NULL REFERENCES subscription_plans(id),
  status            TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT,
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- A5. Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(referrer_id, referred_user_id)
);

-- A6. Admin Audit Log
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════════════════════════════════════════
-- PART B: ADD MISSING COLUMNS (IF NOT EXISTS = safe to re-run)
-- ═══════════════════════════════════════════════════════════

-- B1. service_categories.image_url (migration 003)
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- B2. coupons extra columns (migration 010)
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS expires_at DATE;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'percentage';
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_value NUMERIC(10,2);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_redemptions INT;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS current_redemptions INT DEFAULT 0;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS terms_conditions TEXT;

-- B3. profiles monetization columns (migration 012)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier UUID REFERENCES subscription_plans(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- B4. coupons partner_id (migration 012)
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES profiles(id);
CREATE INDEX IF NOT EXISTS idx_coupons_is_premium ON coupons(is_premium);

-- B5. provider_requests neighborhood + hours (migration 017)
ALTER TABLE provider_requests ADD COLUMN IF NOT EXISTS neighborhood TEXT;
ALTER TABLE provider_requests ADD COLUMN IF NOT EXISTS hours TEXT;

-- B6. service_providers user_id + updated_at (migration 018)
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE service_providers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON service_providers(user_id);

-- B7. Unique constraints on slugs (migration 013)
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


-- ═══════════════════════════════════════════════════════════
-- PART C: MISSING INDEXES
-- ═══════════════════════════════════════════════════════════

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
CREATE INDEX IF NOT EXISTS idx_activities_category        ON activities(category_id);
CREATE INDEX IF NOT EXISTS idx_activities_active          ON activities(is_active);
CREATE INDEX IF NOT EXISTS idx_activities_featured        ON activities(is_featured);
CREATE INDEX IF NOT EXISTS idx_activity_categories_active ON activity_categories(is_active);


-- ═══════════════════════════════════════════════════════════
-- PART D: FUNCTIONS & TRIGGERS
-- ═══════════════════════════════════════════════════════════

-- D1. get_user_role() helper — used by ALL admin RLS policies
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- D2. handle_new_user() trigger — auto-creates profile on signup
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ═══════════════════════════════════════════════════════════
-- PART E: ENABLE RLS ON ALL TABLES
-- ═══════════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;


-- ═══════════════════════════════════════════════════════════
-- PART F: ALL RLS POLICIES
-- ═══════════════════════════════════════════════════════════

-- ─────────────────────────────────────────
-- F1. PROFILES (3 policies)
-- ─────────────────────────────────────────
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
-- F2. SERVICE CATEGORIES (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view active categories"
  ON service_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage categories"
  ON service_categories FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F3. SERVICE PROVIDERS (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view active providers"
  ON service_providers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage providers"
  ON service_providers FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F4. PROVIDER REQUESTS (4 policies)
-- ─────────────────────────────────────────
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
-- F5. EVENTS (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view active events"
  ON events FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage events"
  ON events FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F6. EVENT REQUESTS (3 policies — no business_user INSERT per migration 016)
-- ─────────────────────────────────────────
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
-- F7. COUPON CATEGORIES (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view active coupon categories"
  ON coupon_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage coupon categories"
  ON coupon_categories FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F8. COUPONS (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage coupons"
  ON coupons FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F9. COUPON REQUESTS (3 policies — no business_user INSERT per migration 016)
-- ─────────────────────────────────────────
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
-- F10. ANNOUNCEMENTS (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view active announcements"
  ON announcements FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage announcements"
  ON announcements FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F11. SUBSCRIBERS (3 policies)
-- ─────────────────────────────────────────
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
-- F12. BANNERS (2 policies)
-- ─────────────────────────────────────────
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
-- F13. PAGES (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view pages"
  ON pages FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage pages"
  ON pages FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F14. ACTIVITY CATEGORIES (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view active activity categories"
  ON activity_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage activity categories"
  ON activity_categories FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F15. ACTIVITIES (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view active activities"
  ON activities FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage activities"
  ON activities FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F16. HERO SLIDES (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view active hero slides"
  ON hero_slides FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage hero slides"
  ON hero_slides FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F17. HERO STATS (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "Anyone can view active hero stats"
  ON hero_stats FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage hero stats"
  ON hero_stats FOR ALL
  USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F18. SUBSCRIPTION PLANS (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "plans_public_read" ON subscription_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "plans_admin_all" ON subscription_plans
  FOR ALL USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F19. USER SUBSCRIPTIONS (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "subscriptions_own_read" ON user_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "subscriptions_admin_read" ON user_subscriptions
  FOR ALL USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F20. REFERRALS (2 policies)
-- ─────────────────────────────────────────
CREATE POLICY "referrals_admin_all" ON referrals
  FOR ALL USING (get_user_role() = 'admin');

CREATE POLICY "referrals_read_own" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);


-- ─────────────────────────────────────────
-- F21. ADMIN AUDIT LOG (1 policy)
-- ─────────────────────────────────────────
CREATE POLICY "audit_log_admin_all" ON admin_audit_log
  FOR ALL USING (get_user_role() = 'admin');


-- ─────────────────────────────────────────
-- F22. STORAGE POLICIES (provider-images bucket only)
-- ─────────────────────────────────────────
CREATE POLICY "Business users can upload provider images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'provider-images'
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

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


-- ═══════════════════════════════════════════════════════════
-- PART G: SEED DATA (subscription plans)
-- ═══════════════════════════════════════════════════════════

-- Ensure slug has a unique constraint before seeding
DO $$ BEGIN
  ALTER TABLE subscription_plans ADD CONSTRAINT subscription_plans_slug_key UNIQUE (slug);
EXCEPTION WHEN duplicate_table THEN NULL;
          WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  INSERT INTO subscription_plans (name, slug, price_monthly, price_yearly, description, features, is_featured, display_order) VALUES
  ('Free', 'free', 0, 0, 'Get started with the basics',
    ARRAY['Browse all events & listings', 'View coupons', 'Basic search'], false, 1),
  ('Insider', 'insider', 4.99, 49.99, 'Unlock exclusive Columbus deals',
    ARRAY['Everything in Free', 'Exclusive member coupons', 'Early event access', 'Email deal alerts'], false, 2),
  ('VIP', 'vip', 9.99, 99.99, 'The full Columbus experience',
    ARRAY['Everything in Insider', 'Premium deal alerts', 'Priority customer support', 'Featured business discounts', 'Monthly Columbus guide'], true, 3),
  ('Business', 'business', 14.99, 149.99, 'For local businesses to reach Columbus',
    ARRAY['Everything in VIP', 'List your business', 'Submit unlimited coupons', 'Analytics dashboard', 'Featured placement'], false, 4);
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'Subscription plans already seeded, skipping.';
END $$;


-- ═══════════════════════════════════════════════════════════
-- PART H: ADMIN USER (admin@columbus.com / marketplace)
-- ═══════════════════════════════════════════════════════════

DO $$
BEGIN
  -- Insert auth user (skip if already exists)
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
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'Admin auth user already exists, skipping.';
END $$;

DO $$
BEGIN
  -- Insert identity (skip if already exists)
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
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'Admin identity already exists, skipping.';
END $$;

DO $$
BEGIN
  -- Insert or update profile to admin role
  INSERT INTO profiles (id, email, role)
  VALUES ('ad78cc7e-37fa-4eea-83fd-50d972478222', 'admin@columbus.com', 'admin');
EXCEPTION WHEN unique_violation THEN
  UPDATE profiles SET role = 'admin' WHERE id = 'ad78cc7e-37fa-4eea-83fd-50d972478222';
END $$;


-- ═══════════════════════════════════════════════════════════
-- DONE! Verify:
--   1. Authentication → Policies  (should show policies on all 21 tables)
--   2. Authentication → Users     (should show admin@columbus.com)
--   3. Try login with admin@columbus.com / marketplace
-- ═══════════════════════════════════════════════════════════

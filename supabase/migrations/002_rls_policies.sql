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

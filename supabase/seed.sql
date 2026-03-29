-- ============================================================
-- Catch Columbus — Seed Data
-- Run this AFTER 001 and 002 migrations
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ─────────────────────────────────────────
-- SERVICE CATEGORIES
-- ─────────────────────────────────────────
INSERT INTO service_categories (name, slug, icon, description, display_order) VALUES
  ('Handyman',          'handyman',         '🔧', 'General home repairs and maintenance',       1),
  ('Electrical',        'electrical',       '⚡', 'Licensed electricians for home and business', 2),
  ('Plumbing',          'plumbing',         '🚿', 'Plumbing installation and repairs',           3),
  ('Mobile Mechanic',   'mobile-mechanic',  '🚗', 'Auto repair services that come to you',       4),
  ('Restaurant',        'restaurant',       '🍽️', 'Local Columbus restaurants and dining',       5),
  ('Mobile & Tech',     'mobile-tech',      '📱', 'Phone, tablet, and computer repairs',         6),
  ('Cleaning',          'cleaning',         '🧹', 'Residential and commercial cleaning services',7),
  ('Landscaping',       'landscaping',      '🌿', 'Lawn care, landscaping, and tree services',   8),
  ('HVAC',              'hvac',             '❄️', 'Heating, ventilation, and air conditioning',  9),
  ('Moving',            'moving',           '📦', 'Local moving and packing services',           10)
ON CONFLICT (slug) DO NOTHING;


-- ─────────────────────────────────────────
-- COUPON CATEGORIES
-- ─────────────────────────────────────────
INSERT INTO coupon_categories (name, slug, display_order) VALUES
  ('Food',     'food',     1),
  ('Events',   'events',   2),
  ('Services', 'services', 3),
  ('Products', 'products', 4)
ON CONFLICT (slug) DO NOTHING;


-- ─────────────────────────────────────────
-- ANNOUNCEMENTS (welcome message)
-- ─────────────────────────────────────────
INSERT INTO announcements (title, content, is_pinned, is_active) VALUES
  (
    'Welcome to Catch Columbus!',
    'Your one-stop guide to everything Columbus, Ohio has to offer. Discover local events, services, coupons, and more. Are you a local business? Submit your listing today!',
    true,
    true
  )
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────
-- PAGES (About page placeholder)
-- ─────────────────────────────────────────
INSERT INTO pages (slug, title, content, meta_description) VALUES
  (
    'about',
    'About Columbus',
    '{
      "hero_heading": "About Columbus, Ohio",
      "hero_subheading": "A city of innovation, culture, and community",
      "history_title": "A Rich History",
      "history_text": "Columbus, Ohio was founded in 1812 and named after explorer Christopher Columbus. It became the state capital in 1816 and has grown to become the largest city in Ohio and one of the fastest-growing cities in the Midwest.",
      "achievements_title": "City Achievements & Highlights",
      "achievements": [
        "Home to The Ohio State University, one of the largest universities in the US",
        "Ranked among the top cities for job growth and business climate",
        "Known for its vibrant Short North Arts District",
        "Home to the Columbus Zoo, ranked among the best in the nation",
        "Host city for major events including the Arnold Sports Festival"
      ]
    }',
    'Learn about Columbus, Ohio — its rich history, achievements, and what makes it a great place to live, work, and play.'
  )
ON CONFLICT (slug) DO NOTHING;

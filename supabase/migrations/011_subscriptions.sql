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

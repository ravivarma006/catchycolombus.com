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

-- Add expiration and enhanced fields to coupons table
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS expires_at DATE;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'percentage';
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_value NUMERIC(10,2);
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_redemptions INT;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS current_redemptions INT DEFAULT 0;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS terms_conditions TEXT;

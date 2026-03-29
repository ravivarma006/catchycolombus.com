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

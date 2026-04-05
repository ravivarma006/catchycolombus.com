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

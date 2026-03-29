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

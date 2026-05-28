-- Allow any authenticated user (including visitors) to insert their own
-- provider_request. Admin still reviews and approves before the listing
-- becomes live in service_providers. Update/select policies are unchanged.

DROP POLICY IF EXISTS "Business users can insert own requests" ON provider_requests;

CREATE POLICY "Authenticated users can insert own requests"
  ON provider_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

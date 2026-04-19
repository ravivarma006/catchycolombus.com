-- Business users should ONLY be able to submit their own business listing.
-- Events and coupons are admin-only. Remove business_user access at every
-- layer where it was previously granted.

-- 1. Storage: drop the event-images & coupon-images INSERT policies
DROP POLICY IF EXISTS "Business users can upload event images"  ON storage.objects;
DROP POLICY IF EXISTS "Business users can upload coupon images" ON storage.objects;

-- 2. Storage: narrow update/delete policies to provider-images only
DROP POLICY IF EXISTS "Business users can update own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Business users can delete own uploads" ON storage.objects;

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

-- 3. Table RLS: drop business_user INSERT on event_requests & coupon_requests
DROP POLICY IF EXISTS "Business users can insert own event requests"  ON public.event_requests;
DROP POLICY IF EXISTS "Business users can insert own coupon requests" ON public.coupon_requests;

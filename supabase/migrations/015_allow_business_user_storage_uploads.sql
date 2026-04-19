-- Business users need to upload logos/photos for their provider, event,
-- and coupon submissions. Previously only 'admin' could write to storage,
-- which caused "new row violates row-level security policy" on the
-- business submission forms.

-- Allow INSERT for business_user & admin on the 3 submission buckets
CREATE POLICY "Business users can upload provider images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'provider-images'
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

CREATE POLICY "Business users can upload event images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'event-images'
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

CREATE POLICY "Business users can upload coupon images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'coupon-images'
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

-- Allow users to UPDATE/DELETE their own uploads in those buckets
CREATE POLICY "Business users can update own uploads"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id IN ('provider-images','event-images','coupon-images')
  AND owner = auth.uid()
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

CREATE POLICY "Business users can delete own uploads"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id IN ('provider-images','event-images','coupon-images')
  AND owner = auth.uid()
  AND get_user_role() = ANY (ARRAY['business_user','admin'])
);

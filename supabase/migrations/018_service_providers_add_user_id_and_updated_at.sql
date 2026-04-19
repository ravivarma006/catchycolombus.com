-- Approve-provider flow and the business-user dashboard both reference
-- service_providers.user_id, but the column never existed -- every approve
-- was failing with "column user_id does not exist". Add it (nullable, FK to
-- auth.users with ON DELETE SET NULL so deleting an owner doesn't wipe out
-- the public listing). Also add updated_at so future edit flows have it.

ALTER TABLE public.service_providers
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_service_providers_user_id
  ON public.service_providers(user_id);

-- Backfill: for already-approved providers, try to recover the owner from
-- the matching provider_requests row (same business name, approved status).
UPDATE public.service_providers sp
SET user_id = pr.user_id
FROM public.provider_requests pr
WHERE sp.user_id IS NULL
  AND pr.status = 'approved'
  AND lower(trim(pr.business_name)) = lower(trim(sp.name));

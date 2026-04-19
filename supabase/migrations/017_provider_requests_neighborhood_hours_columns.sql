-- Give provider_requests proper columns for neighborhood and hours.
-- Previously these were stuffed into admin_notes (which is also used
-- by admins to leave feedback), so admin feedback would overwrite the
-- business owner's data. Moving them to dedicated columns.

ALTER TABLE public.provider_requests
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS hours        text;

-- Best-effort backfill: parse "Neighborhood: X | Hours: Y" out of
-- admin_notes for rows that clearly look like the old synthetic payload.
UPDATE public.provider_requests
SET
  neighborhood = COALESCE(
    neighborhood,
    NULLIF(substring(admin_notes FROM 'Neighborhood:\s*([^|]+?)(?:\s*\||$)'), '')
  ),
  hours = COALESCE(
    hours,
    NULLIF(substring(admin_notes FROM 'Hours:\s*(.+?)$'), '')
  ),
  admin_notes = CASE
    WHEN admin_notes ~ '^(Neighborhood:[^|]*)?(\s*\|\s*Hours:.*)?$' THEN NULL
    ELSE admin_notes
  END
WHERE admin_notes ILIKE 'Neighborhood:%' OR admin_notes ILIKE '%| Hours:%';

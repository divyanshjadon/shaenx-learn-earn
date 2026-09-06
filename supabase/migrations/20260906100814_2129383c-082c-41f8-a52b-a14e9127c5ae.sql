CREATE OR REPLACE FUNCTION public.is_eligible_for_bounty(_user_id uuid, _bounty_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.bounties b
    JOIN public.candidate_skills cs ON cs.user_id = _user_id
    JOIN public.skill_tracks st ON st.id = cs.skill_track_id
    WHERE b.id = _bounty_id
      AND b.status = 'open'
      AND lower(st.slug) = ANY (SELECT lower(t) FROM unnest(b.skill_tags) AS t)
  )
$$;

REVOKE ALL ON FUNCTION public.is_eligible_for_bounty(uuid, uuid) FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "user insert own applications" ON public.applications;

CREATE POLICY "eligible users insert own applications"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND public.is_eligible_for_bounty(auth.uid(), bounty_id)
);
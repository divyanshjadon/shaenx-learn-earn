DROP POLICY IF EXISTS "user insert own test_attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "user insert own candidate_skills" ON public.candidate_skills;

CREATE POLICY "screening function only inserts test attempts"
ON public.test_attempts
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "screening function only inserts candidate skills"
ON public.candidate_skills
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.is_eligible_for_bounty(_user_id uuid, _bounty_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.bounties b
    JOIN public.candidate_skills cs ON cs.user_id = _user_id
    JOIN public.skill_tracks st ON st.id = cs.skill_track_id
    WHERE b.id = _bounty_id
      AND b.status = 'open'
      AND lower(st.slug) = ANY (SELECT lower(t) FROM unnest(b.skill_tags) AS t)
  )
$function$;
CREATE OR REPLACE FUNCTION public.get_bounty_applicant_counts()
RETURNS TABLE (bounty_id uuid, applicant_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.bounty_id, count(*)::bigint
  FROM public.applications a
  JOIN public.bounties b ON b.id = a.bounty_id AND b.status = 'open'
  GROUP BY a.bounty_id
$$;

REVOKE ALL ON FUNCTION public.get_bounty_applicant_counts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_bounty_applicant_counts() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS TABLE (open_bounties bigint, total_paid numeric, active_learners bigint, companies bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.bounties WHERE status = 'open'),
    (SELECT COALESCE(sum(b.reward_amount), 0)
       FROM public.applications a
       JOIN public.bounties b ON b.id = a.bounty_id
      WHERE a.status IN ('accepted', 'completed')),
    (SELECT count(DISTINCT user_id) FROM public.candidate_skills),
    (SELECT count(*) FROM public.companies)
$$;

REVOKE ALL ON FUNCTION public.get_platform_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_platform_stats() TO anon, authenticated, service_role;
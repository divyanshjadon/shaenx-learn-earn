REVOKE EXECUTE ON FUNCTION public.get_platform_stats() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_bounty_applicant_counts() FROM anon, authenticated, public;

CREATE OR REPLACE VIEW public.platform_stats AS
SELECT
  (SELECT count(*) FROM public.bounties WHERE status = 'open') AS open_bounties,
  (SELECT COALESCE(sum(b.reward_amount), 0)
     FROM public.applications a
     JOIN public.bounties b ON b.id = a.bounty_id
    WHERE a.status IN ('accepted', 'completed')) AS total_paid,
  (SELECT count(DISTINCT user_id) FROM public.candidate_skills) AS active_learners,
  (SELECT count(*) FROM public.companies) AS companies,
  (SELECT count(DISTINCT u.user_id) FROM (
     SELECT user_id FROM public.candidate_skills
     UNION
     SELECT user_id FROM public.applications
   ) u) AS community_members,
  (SELECT count(*) FROM public.lesson_progress) AS lessons_completed;

GRANT SELECT ON public.platform_stats TO anon, authenticated;

CREATE OR REPLACE VIEW public.bounty_applicant_counts AS
SELECT a.bounty_id, count(*)::bigint AS applicant_count
FROM public.applications a
JOIN public.bounties b ON b.id = a.bounty_id AND b.status = 'open'
GROUP BY a.bounty_id;

GRANT SELECT ON public.bounty_applicant_counts TO anon, authenticated;
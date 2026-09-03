DROP FUNCTION IF EXISTS public.get_platform_stats();
CREATE FUNCTION public.get_platform_stats()
RETURNS TABLE(open_bounties bigint, total_paid numeric, active_learners bigint, companies bigint, community_members bigint, lessons_completed bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT
    (SELECT count(*) FROM public.bounties WHERE status = 'open'),
    (SELECT COALESCE(sum(b.reward_amount), 0)
       FROM public.applications a
       JOIN public.bounties b ON b.id = a.bounty_id
      WHERE a.status IN ('accepted', 'completed')),
    (SELECT count(DISTINCT user_id) FROM public.candidate_skills),
    (SELECT count(*) FROM public.companies),
    (SELECT count(DISTINCT u.user_id) FROM (
       SELECT user_id FROM public.candidate_skills
       UNION
       SELECT user_id FROM public.applications
     ) u),
    (SELECT count(*) FROM public.lesson_progress)
$function$;
DROP VIEW IF EXISTS public.platform_stats;
DROP VIEW IF EXISTS public.bounty_applicant_counts;

-- Platform-wide totals, maintained by triggers
CREATE TABLE public.platform_totals (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  open_bounties bigint NOT NULL DEFAULT 0,
  total_paid numeric NOT NULL DEFAULT 0,
  active_learners bigint NOT NULL DEFAULT 0,
  companies bigint NOT NULL DEFAULT 0,
  community_members bigint NOT NULL DEFAULT 0,
  lessons_completed bigint NOT NULL DEFAULT 0
);
GRANT SELECT ON public.platform_totals TO anon, authenticated;
GRANT ALL ON public.platform_totals TO service_role;
ALTER TABLE public.platform_totals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read platform totals" ON public.platform_totals FOR SELECT USING (true);

INSERT INTO public.platform_totals (id, open_bounties, total_paid, active_learners, companies, community_members, lessons_completed)
SELECT true,
  (SELECT count(*) FROM public.bounties WHERE status = 'open'),
  (SELECT COALESCE(sum(b.reward_amount), 0) FROM public.applications a JOIN public.bounties b ON b.id = a.bounty_id WHERE a.status IN ('accepted', 'completed')),
  (SELECT count(DISTINCT user_id) FROM public.candidate_skills),
  (SELECT count(*) FROM public.companies),
  (SELECT count(DISTINCT u.user_id) FROM (SELECT user_id FROM public.candidate_skills UNION SELECT user_id FROM public.applications) u),
  (SELECT count(*) FROM public.lesson_progress);

CREATE OR REPLACE FUNCTION public.refresh_platform_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.platform_totals SET
    open_bounties = (SELECT count(*) FROM public.bounties WHERE status = 'open'),
    total_paid = (SELECT COALESCE(sum(b.reward_amount), 0) FROM public.applications a JOIN public.bounties b ON b.id = a.bounty_id WHERE a.status IN ('accepted', 'completed')),
    active_learners = (SELECT count(DISTINCT user_id) FROM public.candidate_skills),
    companies = (SELECT count(*) FROM public.companies),
    community_members = (SELECT count(DISTINCT u.user_id) FROM (SELECT user_id FROM public.candidate_skills UNION SELECT user_id FROM public.applications) u),
    lessons_completed = (SELECT count(*) FROM public.lesson_progress)
  WHERE id = true;
  RETURN NULL;
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.refresh_platform_totals() FROM anon, authenticated, public;

CREATE TRIGGER refresh_totals_bounties AFTER INSERT OR UPDATE OR DELETE ON public.bounties FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_platform_totals();
CREATE TRIGGER refresh_totals_applications AFTER INSERT OR UPDATE OR DELETE ON public.applications FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_platform_totals();
CREATE TRIGGER refresh_totals_candidate_skills AFTER INSERT OR UPDATE OR DELETE ON public.candidate_skills FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_platform_totals();
CREATE TRIGGER refresh_totals_companies AFTER INSERT OR UPDATE OR DELETE ON public.companies FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_platform_totals();
CREATE TRIGGER refresh_totals_lesson_progress AFTER INSERT OR UPDATE OR DELETE ON public.lesson_progress FOR EACH STATEMENT EXECUTE FUNCTION public.refresh_platform_totals();

-- Per-bounty applicant counts, maintained by trigger
CREATE TABLE public.bounty_applicant_counts (
  bounty_id uuid PRIMARY KEY REFERENCES public.bounties(id) ON DELETE CASCADE,
  applicant_count bigint NOT NULL DEFAULT 0
);
GRANT SELECT ON public.bounty_applicant_counts TO anon, authenticated;
GRANT ALL ON public.bounty_applicant_counts TO service_role;
ALTER TABLE public.bounty_applicant_counts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read applicant counts" ON public.bounty_applicant_counts FOR SELECT USING (true);

INSERT INTO public.bounty_applicant_counts (bounty_id, applicant_count)
SELECT bounty_id, count(*) FROM public.applications GROUP BY bounty_id;

CREATE OR REPLACE FUNCTION public.refresh_bounty_applicant_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP IN ('DELETE', 'UPDATE') THEN
    INSERT INTO public.bounty_applicant_counts (bounty_id, applicant_count)
    VALUES (OLD.bounty_id, (SELECT count(*) FROM public.applications WHERE bounty_id = OLD.bounty_id))
    ON CONFLICT (bounty_id) DO UPDATE SET applicant_count = EXCLUDED.applicant_count;
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    INSERT INTO public.bounty_applicant_counts (bounty_id, applicant_count)
    VALUES (NEW.bounty_id, (SELECT count(*) FROM public.applications WHERE bounty_id = NEW.bounty_id))
    ON CONFLICT (bounty_id) DO UPDATE SET applicant_count = EXCLUDED.applicant_count;
  END IF;
  RETURN NULL;
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.refresh_bounty_applicant_count() FROM anon, authenticated, public;

CREATE TRIGGER refresh_applicant_count AFTER INSERT OR UPDATE OR DELETE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.refresh_bounty_applicant_count();
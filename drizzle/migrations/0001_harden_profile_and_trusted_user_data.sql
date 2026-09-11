-- Keep public profile names free of email addresses on every insert and update.
CREATE OR REPLACE FUNCTION public.validate_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.display_name IS NOT NULL
     AND NEW.display_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    NEW.display_name := 'Builder';
  END IF;

  IF NEW.avatar_url IS NOT NULL AND NEW.avatar_url !~ '^https://' THEN
    RAISE EXCEPTION 'avatar_url must start with https://';
  END IF;

  IF NEW.twitter IS NOT NULL AND NEW.twitter !~ '^[a-zA-Z0-9_]{1,50}$' THEN
    RAISE EXCEPTION 'twitter username must contain only letters, numbers, and underscores';
  END IF;

  IF NEW.github IS NOT NULL AND NEW.github !~ '^[a-zA-Z0-9_-]{1,39}$' THEN
    RAISE EXCEPTION 'github username must contain only letters, numbers, hyphens, and underscores';
  END IF;

  IF NEW.linkedin IS NOT NULL AND NEW.linkedin !~ '^[a-zA-Z0-9_-]{1,100}$' THEN
    RAISE EXCEPTION 'linkedin username must contain only letters, numbers, hyphens, and underscores';
  END IF;

  RETURN NEW;
END;
$function$;

-- Only trusted server-side processes may write achievement badges.
REVOKE INSERT, UPDATE, DELETE ON public.user_badges FROM PUBLIC, anon, authenticated;
DROP POLICY IF EXISTS "no client badge inserts" ON public.user_badges;
DROP POLICY IF EXISTS "no client badge updates" ON public.user_badges;
DROP POLICY IF EXISTS "no client badge deletes" ON public.user_badges;
CREATE POLICY "no client badge inserts"
  ON public.user_badges FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "no client badge updates"
  ON public.user_badges FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "no client badge deletes"
  ON public.user_badges FOR DELETE TO anon, authenticated USING (false);

-- Keep earnings, reputation, rank, and other statistics server-controlled.
REVOKE INSERT, UPDATE, DELETE ON public.user_stats FROM PUBLIC, anon, authenticated;
DROP POLICY IF EXISTS "no client stats inserts" ON public.user_stats;
DROP POLICY IF EXISTS "no client stats updates" ON public.user_stats;
DROP POLICY IF EXISTS "no client stats deletes" ON public.user_stats;
CREATE POLICY "no client stats inserts"
  ON public.user_stats FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "no client stats updates"
  ON public.user_stats FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "no client stats deletes"
  ON public.user_stats FOR DELETE TO anon, authenticated USING (false);
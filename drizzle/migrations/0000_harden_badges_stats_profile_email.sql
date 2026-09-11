-- 1. Badges: only server-side/trusted processes may write
REVOKE INSERT, UPDATE, DELETE ON public.user_badges FROM anon, authenticated;
GRANT SELECT ON public.user_badges TO authenticated;
GRANT ALL ON public.user_badges TO service_role;

DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can update own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can delete own badges" ON public.user_badges;
DROP POLICY IF EXISTS "no client badge inserts" ON public.user_badges;
CREATE POLICY "no client badge inserts"
  ON public.user_badges FOR INSERT TO anon, authenticated WITH CHECK (false);
DROP POLICY IF EXISTS "no client badge updates" ON public.user_badges;
CREATE POLICY "no client badge updates"
  ON public.user_badges FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "no client badge deletes" ON public.user_badges;
CREATE POLICY "no client badge deletes"
  ON public.user_badges FOR DELETE TO anon, authenticated USING (false);

-- 2. Earnings / reputation stats: read-only for the owner
REVOKE INSERT, UPDATE, DELETE ON public.user_stats FROM anon, authenticated;
GRANT SELECT ON public.user_stats TO authenticated;
GRANT ALL ON public.user_stats TO service_role;

DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can delete own stats" ON public.user_stats;
DROP POLICY IF EXISTS "no client stats inserts" ON public.user_stats;
CREATE POLICY "no client stats inserts"
  ON public.user_stats FOR INSERT TO anon, authenticated WITH CHECK (false);
DROP POLICY IF EXISTS "no client stats updates" ON public.user_stats;
CREATE POLICY "no client stats updates"
  ON public.user_stats FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);
DROP POLICY IF EXISTS "no client stats deletes" ON public.user_stats;
CREATE POLICY "no client stats deletes"
  ON public.user_stats FOR DELETE TO anon, authenticated USING (false);

-- 3. Never let an email address surface in public profile fields
CREATE OR REPLACE FUNCTION public.validate_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.display_name IS NOT NULL
     AND NEW.display_name ~* '[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+' THEN
    NEW.display_name := 'Builder';
  END IF;

  IF NEW.bio IS NOT NULL THEN
    NEW.bio := regexp_replace(NEW.bio, '[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+', '[removed]', 'gi');
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

UPDATE public.profiles
SET display_name = 'Builder'
WHERE display_name ~* '[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+';

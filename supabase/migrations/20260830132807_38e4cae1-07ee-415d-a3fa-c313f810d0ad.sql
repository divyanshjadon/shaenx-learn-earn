-- Keep email addresses out of the publicly readable display_name field.
UPDATE public.profiles
SET display_name = 'Builder'
WHERE display_name IS NOT NULL
  AND display_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$';

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

-- Remove direct client access to the answer-bearing table.
REVOKE SELECT ON public.screening_tests FROM anon, authenticated;
DROP POLICY IF EXISTS "public read screening_tests" ON public.screening_tests;

-- Expose only answer-free screening questions to clients.
DROP VIEW IF EXISTS public.screening_tests_public;
CREATE VIEW public.screening_tests_public AS
SELECT
  st.id,
  st.skill_track_id,
  COALESCE(
    (
      SELECT jsonb_agg(question - 'correct_index')
      FROM jsonb_array_elements(st.questions) AS question
    ),
    '[]'::jsonb
  ) AS questions,
  st.passing_score,
  st.created_at
FROM public.screening_tests AS st;
GRANT SELECT ON public.screening_tests_public TO anon, authenticated;

-- Defense in depth: client roles cannot mutate trusted achievement data.
REVOKE INSERT, UPDATE, DELETE ON public.user_badges FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_stats FROM authenticated;
DROP VIEW IF EXISTS public.screening_tests_public;

CREATE POLICY "No direct client access to screening tests"
ON public.screening_tests
FOR SELECT
TO anon, authenticated
USING (false);

CREATE OR REPLACE FUNCTION public.get_public_screening_tests()
RETURNS TABLE (
  id uuid,
  skill_track_id uuid,
  questions jsonb,
  passing_score integer,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

REVOKE EXECUTE ON FUNCTION public.get_public_screening_tests() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_screening_tests() TO anon, authenticated;
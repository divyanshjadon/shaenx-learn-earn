REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_stats() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Users can insert own badges" ON public.user_badges;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;

UPDATE public.profiles
SET display_name = 'Builder'
WHERE display_name IS NOT NULL
  AND display_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_name text;
BEGIN
  IF NEW.id IS NULL THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;

  requested_name := NULLIF(trim(NEW.raw_user_meta_data->>'display_name'), '');
  IF requested_name IS NULL OR requested_name ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    requested_name := 'Builder';
  END IF;

  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, left(requested_name, 100));
  RETURN NEW;
END;
$$;
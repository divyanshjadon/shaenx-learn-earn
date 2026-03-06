
CREATE OR REPLACE FUNCTION public.validate_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate avatar_url starts with https://
  IF NEW.avatar_url IS NOT NULL AND NEW.avatar_url !~ '^https://' THEN
    RAISE EXCEPTION 'avatar_url must start with https://';
  END IF;

  -- Validate social usernames are alphanumeric + hyphen + underscore + dot
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

CREATE TRIGGER validate_profile_fields_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_fields();

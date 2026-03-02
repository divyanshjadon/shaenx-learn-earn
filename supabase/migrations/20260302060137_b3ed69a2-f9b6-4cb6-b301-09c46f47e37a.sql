ALTER TABLE public.profiles
  ADD COLUMN twitter text DEFAULT null,
  ADD COLUMN github text DEFAULT null,
  ADD COLUMN linkedin text DEFAULT null;
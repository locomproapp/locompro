
-- Elimina la policy anterior si existe
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;

-- Crea la policy corregida usando (select auth.uid())
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles
  FOR SELECT
  USING ((select auth.uid()) = id);

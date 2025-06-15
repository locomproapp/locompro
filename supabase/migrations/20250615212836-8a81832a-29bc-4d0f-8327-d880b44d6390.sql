
-- Elimina la policy anterior si existe
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.profiles;

-- Crea la policy corregida usando (select auth.uid())
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);


-- Elimina la policy anterior si existe
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.profiles;

-- Crea la policy corregida usando (select auth.uid())
CREATE POLICY "Los usuarios pueden insertar su propio perfil"
  ON public.profiles
  FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

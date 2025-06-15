
-- Elimina la policy anterior si existe
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias publicaciones" ON public.posts;

-- Crea la policy corregida usando (select auth.uid())
CREATE POLICY "Users can update their own posts"
  ON public.posts
  FOR UPDATE
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);


-- Elimina la policy anterior si existe
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias publicaciones" ON public.posts;

-- Crea la policy corregida usando (select auth.uid())
CREATE POLICY "Users can delete their own posts"
  ON public.posts
  FOR DELETE
  USING ((select auth.uid()) = user_id);

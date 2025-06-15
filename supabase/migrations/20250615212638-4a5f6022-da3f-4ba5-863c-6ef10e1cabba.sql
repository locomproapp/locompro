
-- Elimina la policy anterior si existe
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Los usuarios pueden crear sus propias publicaciones" ON public.posts;

-- Crea la policy corregida usando (select auth.uid())
CREATE POLICY "Users can create their own posts"
  ON public.posts
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

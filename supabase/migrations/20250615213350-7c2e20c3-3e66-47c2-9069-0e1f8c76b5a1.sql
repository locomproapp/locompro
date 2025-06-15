
-- Eliminar policies antiguas (en inglés y español)
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios chats" ON public.chats;

DROP POLICY IF EXISTS "Users can create chats" ON public.chats;
DROP POLICY IF EXISTS "Los usuarios pueden crear chats" ON public.chats;

-- Crear policies optimizadas
CREATE POLICY "Users can view their own chats"
  ON public.chats
  FOR SELECT
  USING (
    buyer_id = (select auth.uid()) OR seller_id = (select auth.uid())
  );

CREATE POLICY "Users can create chats"
  ON public.chats
  FOR INSERT
  WITH CHECK (
    buyer_id = (select auth.uid()) OR seller_id = (select auth.uid())
  );


-- Eliminar policies antiguas (en inglés y español)
DROP POLICY IF EXISTS "Chat participants can view messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Los participantes pueden ver mensajes" ON public.chat_messages;

DROP POLICY IF EXISTS "Chat participants can create messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Los participantes pueden crear mensajes" ON public.chat_messages;

-- Crear policies optimizadas
CREATE POLICY "Chat participants can view messages"
  ON public.chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE public.chats.id = chat_id
        AND ((buyer_id = (select auth.uid())) OR (seller_id = (select auth.uid())))
    )
  );

CREATE POLICY "Chat participants can create messages"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chats
      WHERE public.chats.id = chat_id
        AND ((buyer_id = (select auth.uid())) OR (seller_id = (select auth.uid())))
    )
  );

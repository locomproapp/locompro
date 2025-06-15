
-- Crear índice para cubrir el foreign key chat_messages_chat_id_fkey en chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages (chat_id);

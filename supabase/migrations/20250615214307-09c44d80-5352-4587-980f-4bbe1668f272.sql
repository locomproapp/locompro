
-- Crear índice para cubrir el foreign key chats_offer_id_fkey en chats
CREATE INDEX IF NOT EXISTS idx_chats_offer_id ON public.chats (offer_id);

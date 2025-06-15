
-- 1. Crear índice en el campo category_id de buy_requests (para la FK)
CREATE INDEX IF NOT EXISTS idx_buy_requests_category_id ON public.buy_requests (category_id);

-- 2. Eliminar los índices no utilizados según Supabase
DROP INDEX IF EXISTS idx_chat_messages_chat_id;
DROP INDEX IF EXISTS idx_chats_offer_id;
DROP INDEX IF EXISTS idx_posts_user_id;
DROP INDEX IF EXISTS idx_reviews_buyer_id;

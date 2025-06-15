
-- Índice para cubrir FK en buy_requests (category_id)
CREATE INDEX IF NOT EXISTS idx_buy_requests_category_id ON public.buy_requests (category_id);

-- Índice para cubrir FK en chat_messages (chat_id)
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages (chat_id);

-- Índices para cubrir FKs en chats (offer_id, buy_request_id, buyer_id, seller_id)
CREATE INDEX IF NOT EXISTS idx_chats_offer_id ON public.chats (offer_id);
CREATE INDEX IF NOT EXISTS idx_chats_buy_request_id ON public.chats (buy_request_id);
CREATE INDEX IF NOT EXISTS idx_chats_buyer_id ON public.chats (buyer_id);
CREATE INDEX IF NOT EXISTS idx_chats_seller_id ON public.chats (seller_id);

-- Índice para cubrir FK en posts (user_id)
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts (user_id);

-- Índices adicionales sugeridos en posts (si existen FKs iguales, por ejemplo dos FKs sobre user_id)
-- En caso de múltiples advertencias sobre posts.user_id, este comando único las cubre.

-- Índice para cubrir FK en reviews (buyer_id)
CREATE INDEX IF NOT EXISTS idx_reviews_buyer_id ON public.reviews (buyer_id);


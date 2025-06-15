
-- Índice para Foreign Key en chat_messages (asumo la FK es chat_id)
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages (chat_id);

-- Índice para Foreign Key en chats (asumo la FK es offer_id y/o buy_request_id)
CREATE INDEX IF NOT EXISTS idx_chats_offer_id ON public.chats (offer_id);
CREATE INDEX IF NOT EXISTS idx_chats_buy_request_id ON public.chats (buy_request_id);

-- Índices para Foreign Keys en posts (asumo user_id y quizas otra columna de FK)
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts (user_id);

-- Si posts tiene otra FK (ejemplo: una columna category_id o similar), crea índice correspondiente aquí (¡dímelo si es el caso!).

-- Índice para Foreign Key en reviews (asumo la FK es buyer_id)
CREATE INDEX IF NOT EXISTS idx_reviews_buyer_id ON public.reviews (buyer_id);

-- Eliminar índice no utilizado en buy_requests (especifica el nombre real si es distinto)
DROP INDEX IF EXISTS idx_buy_requests_category_id;

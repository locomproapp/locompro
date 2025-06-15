
-- 1. Crear índices en las claves foráneas para mejor rendimiento

-- chat_messages: chat_id
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages (chat_id);

-- chats: offer_id
CREATE INDEX IF NOT EXISTS idx_chats_offer_id ON public.chats (offer_id);

-- posts: user_id
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts (user_id);

-- reviews: buyer_id
CREATE INDEX IF NOT EXISTS idx_reviews_buyer_id ON public.reviews (buyer_id);

-- (No hay dos claves foráneas diferentes en posts en tu esquema, pero puede que haya un índice faltante. Si lo necesitas, dime el campo).

-- 2. Eliminar el índice no usado
DROP INDEX IF EXISTS idx_buy_requests_category_id;


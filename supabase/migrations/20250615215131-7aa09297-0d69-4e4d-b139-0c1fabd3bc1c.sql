
-- Eliminar índices no utilizados reportados por Supabase

-- reviews
DROP INDEX IF EXISTS idx_reviews_buyer_id;
DROP INDEX IF EXISTS idx_reviews_offer_id;
DROP INDEX IF EXISTS idx_reviews_seller_id;

-- posts
DROP INDEX IF EXISTS idx_posts_created_at;
DROP INDEX IF EXISTS idx_posts_description;
DROP INDEX IF EXISTS idx_posts_title;
DROP INDEX IF EXISTS idx_posts_user_id;
DROP INDEX IF EXISTS idx_posts_zone;

-- chats
DROP INDEX IF EXISTS idx_chats_buyer_id;
DROP INDEX IF EXISTS idx_chats_offer_id;
DROP INDEX IF EXISTS idx_chats_seller_id;
DROP INDEX IF EXISTS idx_chats_buy_request_id;

-- chat_messages
DROP INDEX IF EXISTS idx_chat_messages_chat_id;

-- buy_requests
DROP INDEX IF EXISTS idx_buy_requests_category;


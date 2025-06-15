
-- Crear índice para cubrir el foreign key posts_user_id_fkey en posts
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts (user_id);

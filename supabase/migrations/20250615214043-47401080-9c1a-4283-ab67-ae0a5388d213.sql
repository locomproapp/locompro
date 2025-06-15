
-- Eliminar índices no utilizados en la tabla posts
DROP INDEX IF EXISTS idx_posts_created_at;
DROP INDEX IF EXISTS idx_posts_zone;
DROP INDEX IF EXISTS idx_posts_description;
DROP INDEX IF EXISTS idx_posts_title;
DROP INDEX IF EXISTS idx_posts_user_id;

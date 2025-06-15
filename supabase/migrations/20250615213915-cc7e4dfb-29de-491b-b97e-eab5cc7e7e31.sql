
-- 1. Elimina la policy redundante en public.profiles
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- 2. Deja solo un índice sobre posts.user_id
DROP INDEX IF EXISTS idx_posts_user_id_fk;
-- Conservamos idx_posts_user_id (puedes invertir si prefieres el otro, solo invierte los nombres)


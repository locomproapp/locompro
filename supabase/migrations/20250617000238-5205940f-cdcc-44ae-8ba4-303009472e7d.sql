
-- Actualizar la foreign key para que apunte a profiles en lugar de auth.users
ALTER TABLE public.buy_requests 
DROP CONSTRAINT IF EXISTS buy_requests_user_id_fkey;

ALTER TABLE public.buy_requests 
ADD CONSTRAINT buy_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

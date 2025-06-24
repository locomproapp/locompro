
-- First, let's check the current foreign key constraint and fix it
-- The buy_requests.user_id should reference profiles.id, not auth.users.id directly

-- Drop the existing constraint if it exists
ALTER TABLE public.buy_requests 
DROP CONSTRAINT IF EXISTS buy_requests_user_id_fkey;

-- Add the correct foreign key constraint pointing to profiles table
ALTER TABLE public.buy_requests 
ADD CONSTRAINT buy_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also make sure we have an index for better performance
CREATE INDEX IF NOT EXISTS idx_buy_requests_user_id ON public.buy_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

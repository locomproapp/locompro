
-- Add the missing foreign key constraint between offers and buy_requests
ALTER TABLE public.offers 
ADD CONSTRAINT offers_buy_request_id_fkey 
FOREIGN KEY (buy_request_id) REFERENCES public.buy_requests(id) ON DELETE CASCADE;

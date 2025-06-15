
-- Crear índice para cubrir el foreign key buy_requests_category_id_fkey en buy_requests
CREATE INDEX IF NOT EXISTS idx_buy_requests_category_id ON public.buy_requests (category_id);


-- Crear índice para cubrir el foreign key reviews_buyer_id_fkey en reviews
CREATE INDEX IF NOT EXISTS idx_reviews_buyer_id ON public.reviews (buyer_id);

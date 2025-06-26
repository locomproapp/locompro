
-- Actualizar función update_buy_requests_updated_at para incluir search_path seguro
CREATE OR REPLACE FUNCTION public.update_buy_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

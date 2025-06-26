
-- Actualizar función update_user_posts_updated_at para incluir search_path seguro
CREATE OR REPLACE FUNCTION public.update_user_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Actualizar función set_reference_image para incluir search_path seguro
CREATE OR REPLACE FUNCTION public.set_reference_image()
RETURNS TRIGGER AS $$
BEGIN
  IF array_length(NEW.images, 1) > 0 THEN
    NEW.reference_image = NEW.images[1];
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Actualizar función finalize_other_offers para incluir search_path seguro
CREATE OR REPLACE FUNCTION public.finalize_other_offers()
RETURNS TRIGGER AS $$
BEGIN
  -- If an offer is accepted, finalize all other offers for the same buy request
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    UPDATE public.buy_request_offers 
    SET 
      status = 'finalized',
      updated_at = now()
    WHERE 
      buy_request_id = NEW.buy_request_id 
      AND id != NEW.id 
      AND status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Actualizar función update_buy_request_offers_updated_at para incluir search_path seguro
CREATE OR REPLACE FUNCTION public.update_buy_request_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

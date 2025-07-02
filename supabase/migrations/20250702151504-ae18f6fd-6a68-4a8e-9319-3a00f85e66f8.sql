
-- Delete existing offers for this buy request
DELETE FROM public.offers WHERE buy_request_id = 'dfe5267a-02b1-465c-b557-bb480a7fc97b';

-- Create 3 test offers for the buy request
INSERT INTO public.offers (
  buy_request_id,
  seller_id,
  title,
  description,
  price,
  images,
  contact_info,
  delivery_time,
  status
) VALUES 
(
  'dfe5267a-02b1-465c-b557-bb480a7fc97b',
  'b787b200-6709-4cfc-87e2-8d2e6da6b6e4', -- Replace with actual seller ID
  'iPhone 15 Pro Max 256GB Azul Titanio',
  'iPhone 15 Pro Max en perfecto estado, con caja original y todos los accesorios. Comprado hace 3 meses.',
  850000,
  ARRAY['https://example.com/iphone1.jpg', 'https://example.com/iphone2.jpg'],
  '{"whatsapp": "+54 11 1234-5678", "email": "vendedor1@test.com"}',
  '2-3 días',
  'pending'
),
(
  'dfe5267a-02b1-465c-b557-bb480a7fc97b',
  'b787b200-6709-4cfc-87e2-8d2e6da6b6e4', -- Replace with actual seller ID
  'iPhone 15 Pro Max 512GB Natural Titanium',
  'iPhone 15 Pro Max de 512GB, usado por 6 meses. Excelente condición, sin rayones.',
  920000,
  ARRAY['https://example.com/iphone3.jpg'],
  '{"whatsapp": "+54 11 9876-5432", "email": "vendedor2@test.com"}',
  '1-2 días',
  'pending'
),
(
  'dfe5267a-02b1-465c-b557-bb480a7fc97b',
  'b787b200-6709-4cfc-87e2-8d2e6da6b6e4', -- Replace with actual seller ID
  'iPhone 15 Pro Max 128GB Blanco Titanio',
  'iPhone 15 Pro Max prácticamente nuevo, solo 1 mes de uso. Incluye funda y protector.',
  800000,
  ARRAY['https://example.com/iphone4.jpg', 'https://example.com/iphone5.jpg'],
  '{"whatsapp": "+54 11 5555-1234", "email": "vendedor3@test.com"}',
  '1 día',
  'pending'
);

-- Create or update trigger function to update buy request status when offer is accepted
CREATE OR REPLACE FUNCTION public.update_buy_request_status_on_offer_acceptance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If an offer is accepted, update the buy request status to 'finalized'
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    UPDATE public.buy_requests 
    SET 
      status = 'finalized',
      updated_at = now()
    WHERE id = NEW.buy_request_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update buy request status when offer is accepted
DROP TRIGGER IF EXISTS trigger_update_buy_request_status ON public.offers;
CREATE TRIGGER trigger_update_buy_request_status
  AFTER UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_buy_request_status_on_offer_acceptance();

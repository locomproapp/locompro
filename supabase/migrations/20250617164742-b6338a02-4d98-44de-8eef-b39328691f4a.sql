
-- Create offers table for buy requests
CREATE TABLE IF NOT EXISTS public.buy_request_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buy_request_id UUID NOT NULL REFERENCES public.buy_requests(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  zone TEXT NOT NULL,
  characteristics JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'finalized')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.buy_request_offers ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view public offers
CREATE POLICY "Everyone can view buy request offers" 
  ON public.buy_request_offers 
  FOR SELECT 
  USING (true);

-- Policy: Authenticated users can create offers
CREATE POLICY "Authenticated users can create offers" 
  ON public.buy_request_offers 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = seller_id);

-- Policy: Sellers can update their own offers (withdraw, edit)
CREATE POLICY "Sellers can update their own offers" 
  ON public.buy_request_offers 
  FOR UPDATE 
  USING (auth.uid() = seller_id);

-- Policy: Buy request owners can update offer status (accept/reject)
CREATE POLICY "Buy request owners can update offer status" 
  ON public.buy_request_offers 
  FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.buy_requests WHERE id = buy_request_id
    )
  );

-- Create function to automatically finalize other offers when one is accepted
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
$$ LANGUAGE plpgsql;

-- Create trigger for auto-finalizing offers
CREATE TRIGGER finalize_other_offers_trigger
  AFTER UPDATE ON public.buy_request_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.finalize_other_offers();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_buy_request_offers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER update_buy_request_offers_updated_at_trigger
  BEFORE UPDATE ON public.buy_request_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_buy_request_offers_updated_at();

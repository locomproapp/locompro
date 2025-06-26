
-- First, let's drop all existing policies on the offers table
DROP POLICY IF EXISTS "Users can view offers for their buy requests" ON public.offers;
DROP POLICY IF EXISTS "Sellers can view their own offers" ON public.offers;
DROP POLICY IF EXISTS "Buy request owners can view all offers for their requests" ON public.offers;
DROP POLICY IF EXISTS "All authenticated users can view offers" ON public.offers;
DROP POLICY IF EXISTS "Sellers can update their own offers" ON public.offers;
DROP POLICY IF EXISTS "Buy request owners can update offer status" ON public.offers;
DROP POLICY IF EXISTS "Authenticated users can create offers" ON public.offers;
DROP POLICY IF EXISTS "Sellers can delete their own offers" ON public.offers;

-- Now create all the policies fresh
CREATE POLICY "Public read access to all offers"
  ON public.offers
  FOR SELECT
  USING (true);

CREATE POLICY "Sellers can update their own offers" 
  ON public.offers 
  FOR UPDATE 
  USING (auth.uid() = seller_id);

CREATE POLICY "Buy request owners can update offer status" 
  ON public.offers 
  FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.buy_requests WHERE id = buy_request_id
    )
  );

CREATE POLICY "Authenticated users can create offers" 
  ON public.offers 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own offers" 
  ON public.offers 
  FOR DELETE 
  USING (auth.uid() = seller_id);

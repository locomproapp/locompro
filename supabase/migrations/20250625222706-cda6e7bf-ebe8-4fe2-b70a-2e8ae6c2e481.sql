
-- Add policy to allow all authenticated users to view all offers
CREATE POLICY "All authenticated users can view offers"
  ON public.offers
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

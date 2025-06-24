
-- Update the policy to allow anonymous users to view active buy requests
DROP POLICY IF EXISTS "Anyone can view active buy requests" ON public.buy_requests;

-- Create a policy that allows both authenticated and anonymous users to view active buy requests
CREATE POLICY "Public can view active buy requests"
  ON public.buy_requests
  FOR SELECT
  USING (status = 'active');

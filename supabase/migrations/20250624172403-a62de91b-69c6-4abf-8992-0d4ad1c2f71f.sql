
-- First, let's remove any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can only view their own buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Users can view their own buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Authenticated users can view their own buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Anyone can view active buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Authenticated users can create buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Users can update their own buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Users can delete their own buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Users can insert their own buy requests" ON public.buy_requests;

-- Create a clear policy that allows everyone to view active buy requests
CREATE POLICY "Anyone can view active buy requests"
  ON public.buy_requests
  FOR SELECT
  USING (status = 'active');

-- Allow authenticated users to create buy requests
CREATE POLICY "Authenticated users can create buy requests" 
  ON public.buy_requests 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own buy requests
CREATE POLICY "Users can update their own buy requests" 
  ON public.buy_requests 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Allow users to delete only their own buy requests
CREATE POLICY "Users can delete their own buy requests" 
  ON public.buy_requests 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

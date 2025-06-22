
-- Check if delete policy exists for buy_requests table
-- If not, create it to allow users to delete their own buy requests
CREATE POLICY "Users can delete their own buy requests" 
ON public.buy_requests 
FOR DELETE 
USING (auth.uid() = user_id);

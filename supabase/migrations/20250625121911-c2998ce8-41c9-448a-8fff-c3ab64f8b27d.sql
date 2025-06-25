
-- First, let's see all buy requests to identify the correct one to delete
SELECT id, title, min_price, max_price, zone, user_id, created_at 
FROM public.buy_requests 
ORDER BY created_at DESC;

-- Delete the buy request with title "Test titulo" (matching the console log)
-- This should be the one with price range $10-$20 and zone "Pilar"
DELETE FROM public.buy_requests 
WHERE title = 'Test titulo' 
  AND min_price = 10 
  AND max_price = 20 
  AND zone = 'Pilar';

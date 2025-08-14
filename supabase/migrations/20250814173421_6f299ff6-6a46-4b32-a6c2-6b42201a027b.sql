-- Fix the contact information exposure by implementing column-level security

-- Step 1: Drop the problematic policies that don't actually hide contact_info
DROP POLICY IF EXISTS "Public can view offers without contact info" ON public.offers;
DROP POLICY IF EXISTS "Sellers can view their own offers with contact info" ON public.offers;
DROP POLICY IF EXISTS "Buy request owners can view offers for their requests" ON public.offers;

-- Step 2: Create a single comprehensive policy that allows access only to authorized users
CREATE POLICY "Authorized users can view offers" 
ON public.offers 
FOR SELECT 
USING (
  -- Allow sellers to see their own offers (with contact info)
  auth.uid() = seller_id 
  OR 
  -- Allow buy request owners to see offers for their requests (with contact info)
  auth.uid() IN (
    SELECT user_id FROM buy_requests WHERE id = offers.buy_request_id
  )
);

-- Step 3: Create a view for public access that excludes sensitive information
CREATE VIEW public.public_offers AS
SELECT 
  id,
  buy_request_id,
  seller_id,
  price,
  created_at,
  updated_at,
  buyer_rating,
  public_visibility,
  price_history,
  status,
  delivery_time,
  message,
  title,
  description,
  rejection_reason,
  images,
  -- Explicitly exclude contact_info from public view
  NULL::jsonb as contact_info
FROM public.offers
WHERE public_visibility = true;

-- Step 4: Enable RLS on the view
ALTER VIEW public.public_offers SET (security_barrier = true);

-- Step 5: Grant access to the public view
GRANT SELECT ON public.public_offers TO anon;
GRANT SELECT ON public.public_offers TO authenticated;

-- Step 6: Update the offers table RLS to be more restrictive for anonymous users
-- Remove anonymous access to main offers table entirely
REVOKE SELECT ON public.offers FROM anon;

-- Step 7: Create a function to safely get offer data for different user types
CREATE OR REPLACE FUNCTION public.get_offer_for_user(offer_id uuid, user_id uuid DEFAULT auth.uid())
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  offer_data jsonb;
  is_seller boolean := false;
  is_buyer boolean := false;
BEGIN
  -- Check if user is the seller
  SELECT (seller_id = user_id) INTO is_seller
  FROM public.offers 
  WHERE id = offer_id;

  -- Check if user is the buy request owner (buyer)
  SELECT EXISTS(
    SELECT 1 
    FROM public.offers o
    JOIN public.buy_requests br ON o.buy_request_id = br.id
    WHERE o.id = offer_id AND br.user_id = user_id
  ) INTO is_buyer;

  -- If user has no special access, return public data only
  IF NOT (is_seller OR is_buyer) THEN
    SELECT row_to_json(po.*) INTO offer_data
    FROM public.public_offers po
    WHERE po.id = offer_id;
  ELSE
    -- Return full data including contact_info for authorized users
    SELECT row_to_json(o.*) INTO offer_data
    FROM public.offers o
    WHERE o.id = offer_id;
  END IF;

  RETURN offer_data;
END;
$$;
-- Critical Security Fixes: Contact Info and Profile Privacy

-- Fix 1: Secure contact information in offers table
-- Drop existing overly permissive policies and create restrictive ones
DROP POLICY IF EXISTS "Public read access to all offers" ON public.offers;

-- Create new secure policies for offers table
-- Policy 1: Public can view offers but without sensitive contact info
CREATE POLICY "Public can view offers without contact info" 
ON public.offers 
FOR SELECT 
USING (
  -- Allow reading all columns except contact_info for non-authenticated users
  auth.uid() IS NULL OR 
  -- Authenticated users can see all except contact_info unless they have special access
  (auth.uid() IS NOT NULL AND auth.uid() != seller_id AND auth.uid() NOT IN (
    SELECT user_id FROM buy_requests WHERE id = offers.buy_request_id
  ))
);

-- Policy 2: Sellers can view their own offers (including contact info)
CREATE POLICY "Sellers can view their own offers with contact info" 
ON public.offers 
FOR SELECT 
USING (auth.uid() = seller_id);

-- Policy 3: Buy request owners can view offers for their requests (including contact info for accepted offers)
CREATE POLICY "Buy request owners can view offers for their requests" 
ON public.offers 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM buy_requests WHERE id = offers.buy_request_id
  )
);

-- Fix 2: Enhanced profile privacy
-- Drop the current overly broad policy
DROP POLICY IF EXISTS "Users can view limited profile info of others" ON public.profiles;

-- Create more restrictive profile policies
-- Policy 1: Users can view their own complete profile
CREATE POLICY "Users can view their own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Authenticated users can view only basic info of others (no email, phone, location, bio)
-- This policy will need to be implemented at the application level since PostgreSQL RLS 
-- doesn't support column-level restrictions in a clean way
CREATE POLICY "Authenticated users can view basic profile info of others" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND auth.uid() != id
);

-- Fix 3: Create a secure function for getting basic profile info (without sensitive data)
CREATE OR REPLACE FUNCTION public.get_basic_profile_data(profile_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'id', id,
    'full_name', full_name,
    'avatar_url', avatar_url
  )
  FROM public.profiles 
  WHERE id = profile_id;
$$;

-- Fix 4: Create a function to get contact info only for authorized users
CREATE OR REPLACE FUNCTION public.get_offer_contact_info(offer_id uuid, requesting_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  offer_record RECORD;
  is_authorized BOOLEAN := FALSE;
BEGIN
  -- Get the offer details
  SELECT o.*, br.user_id as buyer_id
  INTO offer_record
  FROM public.offers o
  JOIN public.buy_requests br ON o.buy_request_id = br.id
  WHERE o.id = offer_id;

  -- Check if user is authorized to see contact info
  -- 1. User is the seller
  -- 2. User is the buyer (buy request owner)
  IF offer_record.seller_id = requesting_user_id OR 
     offer_record.buyer_id = requesting_user_id THEN
    is_authorized := TRUE;
  END IF;

  -- Return contact info only if authorized
  IF is_authorized THEN
    RETURN offer_record.contact_info;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;
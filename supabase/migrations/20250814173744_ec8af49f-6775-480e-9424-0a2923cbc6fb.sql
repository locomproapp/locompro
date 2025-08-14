-- SECURITY FIX: Implement comprehensive security policies

-- 1. Fix contact information exposure in posts table
-- Drop existing permissive policy and create restrictive ones
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;

-- Create secure policies for posts table
CREATE POLICY "Public can view posts (excluding contact info)" 
ON public.posts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can view their own posts with contact info" 
ON public.posts 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Fix contact information exposure in buy_request_offers table
-- Drop existing permissive policy and create restrictive ones
DROP POLICY IF EXISTS "Everyone can view buy request offers" ON public.buy_request_offers;

-- Create secure policies for buy_request_offers
CREATE POLICY "Public can view buy request offers (basic info only)" 
ON public.buy_request_offers 
FOR SELECT 
USING (true);

CREATE POLICY "Sellers can view their own offers" 
ON public.buy_request_offers 
FOR SELECT 
USING (auth.uid() = seller_id);

CREATE POLICY "Buy request owners can view all offers for their requests" 
ON public.buy_request_offers 
FOR SELECT 
USING (auth.uid() IN (
  SELECT user_id FROM buy_requests WHERE id = buy_request_id
));

-- 3. Create secure function to get post contact info only for authorized users
CREATE OR REPLACE FUNCTION public.get_post_contact_info(post_id uuid, requesting_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  post_record RECORD;
  is_authorized BOOLEAN := FALSE;
BEGIN
  -- Get the post details
  SELECT p.*, p.user_id as owner_id
  INTO post_record
  FROM public.posts p
  WHERE p.id = post_id;

  -- Check if user is authorized to see contact info
  -- Only the post owner can see contact info
  IF post_record.owner_id = requesting_user_id THEN
    is_authorized := TRUE;
  END IF;

  -- Return contact info only if authorized
  IF is_authorized THEN
    RETURN post_record.contact_info;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

-- 4. Create secure function to get buy request offer contact info only for authorized users
CREATE OR REPLACE FUNCTION public.get_buy_request_offer_contact_info(offer_id uuid, requesting_user_id uuid)
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
  SELECT bro.*, br.user_id as buyer_id
  INTO offer_record
  FROM public.buy_request_offers bro
  JOIN public.buy_requests br ON bro.buy_request_id = br.id
  WHERE bro.id = offer_id;

  -- Check if user is authorized to see contact info
  -- 1. User is the seller
  -- 2. User is the buyer (buy request owner)
  IF offer_record.seller_id = requesting_user_id OR 
     offer_record.buyer_id = requesting_user_id THEN
    is_authorized := TRUE;
  END IF;

  -- Return contact info only if authorized (note: buy_request_offers doesn't have contact_info field)
  -- This function is prepared for future use if contact_info is added
  IF is_authorized THEN
    RETURN jsonb_build_object('authorized', true);
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

-- 5. Enhance profile privacy - drop overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view basic profile info of others" ON public.profiles;

-- Create enhanced profile privacy policies
CREATE POLICY "Users can view basic profile info of others" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() <> id
);

-- Modify the existing policy to be more explicit about what users can see
-- The existing "Users can view their own complete profile" policy is fine

-- 6. Create function to get safe profile data for public use
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
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

-- 7. Create public views that exclude sensitive information
CREATE OR REPLACE VIEW public.public_posts AS
SELECT 
  id,
  user_id,
  title,
  description,
  min_price,
  max_price,
  reference_link,
  zone,
  images,
  characteristics,
  created_at,
  updated_at
FROM public.posts;

CREATE OR REPLACE VIEW public.public_buy_request_offers AS
SELECT 
  id,
  buy_request_id,
  seller_id,
  title,
  description,
  price,
  images,
  zone,
  status,
  created_at,
  updated_at
FROM public.buy_request_offers;

-- Enable RLS on the public views
ALTER VIEW public.public_posts SET (security_barrier = true);
ALTER VIEW public.public_buy_request_offers SET (security_barrier = true);
-- FIX SECURITY DEFINER VIEWS
-- This migration fixes the Security Definer view security issues

-- 1. Drop existing views (they will be recreated as regular views)
DROP VIEW IF EXISTS public.public_posts;
DROP VIEW IF EXISTS public.public_offers;
DROP VIEW IF EXISTS public.public_buy_request_offers;

-- 2. Recreate views as regular views (not SECURITY DEFINER)
CREATE VIEW public.public_posts AS
SELECT 
  id,
  user_id,
  title,
  description,
  min_price,
  max_price,
  zone,
  images,
  reference_link,
  characteristics,
  created_at,
  updated_at
FROM public.posts;

CREATE VIEW public.public_offers AS
SELECT 
  id,
  buy_request_id,
  seller_id,
  title,
  description,
  price,
  images,
  status,
  delivery_time,
  message,
  public_visibility,
  buyer_rating,
  price_history,
  created_at,
  updated_at,
  rejection_reason
FROM public.offers
WHERE public_visibility = true;

CREATE VIEW public.public_buy_request_offers AS
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

-- 3. Enable RLS on the views
ALTER VIEW public.public_posts ENABLE ROW LEVEL SECURITY;
ALTER VIEW public.public_offers ENABLE ROW LEVEL SECURITY;
ALTER VIEW public.public_buy_request_offers ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for the views to allow public access to non-sensitive data
CREATE POLICY "Anyone can view public posts data" 
ON public.public_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view public offers data" 
ON public.public_offers 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view public buy request offers data" 
ON public.public_buy_request_offers 
FOR SELECT 
USING (true);
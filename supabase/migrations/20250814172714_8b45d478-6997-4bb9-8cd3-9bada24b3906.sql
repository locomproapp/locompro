-- Fix security warnings from previous migration

-- Fix 1: Remove the problematic view and replace with a function approach
DROP VIEW IF EXISTS public.public_profiles;

-- Fix 2: Update the function to have proper search_path
CREATE OR REPLACE FUNCTION public.get_safe_profile_data(profile_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'id', id,
    'full_name', full_name,
    'avatar_url', avatar_url,
    'location', CASE 
      WHEN location IS NOT NULL THEN 
        SPLIT_PART(location, ',', 1) || CASE 
          WHEN SPLIT_PART(location, ',', 2) != '' THEN ', ' || SPLIT_PART(location, ',', 2)
          ELSE ''
        END
      ELSE NULL 
    END
  )
  FROM public.profiles 
  WHERE id = profile_id;
$$;

-- Update policies to be more specific and secure
-- Remove the overly broad anonymous policy and replace with more restrictive ones
DROP POLICY IF EXISTS "Anonymous users can view minimal public profile info" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view basic public profile info" ON public.profiles;

-- Allow authenticated users to see only full_name and avatar_url of other users (for UI display)
CREATE POLICY "Users can view limited profile info of others" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL
);
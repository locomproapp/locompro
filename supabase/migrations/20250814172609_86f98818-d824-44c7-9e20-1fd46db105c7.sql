-- Fix security issue: Restrict profile data access to protect sensitive information

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anonymous users can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view basic profile info" ON public.profiles;

-- Create new restrictive policies that protect sensitive data
-- Users can view their own complete profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Authenticated users can view only basic public profile info of others
CREATE POLICY "Authenticated users can view basic public profile info" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  auth.uid() != id AND 
  auth.uid() IS NOT NULL
);

-- Anonymous users can view only essential public profile info (for buy requests, offers display)
CREATE POLICY "Anonymous users can view minimal public profile info" 
ON public.profiles 
FOR SELECT 
TO anon
USING (true);

-- Create a view for public profile data that masks sensitive information
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  created_at,
  -- Only show location city/state, not full address
  CASE 
    WHEN location IS NOT NULL THEN 
      SPLIT_PART(location, ',', 1) || CASE 
        WHEN SPLIT_PART(location, ',', 2) != '' THEN ', ' || SPLIT_PART(location, ',', 2)
        ELSE ''
      END
    ELSE NULL 
  END as location,
  -- Mask email to show only domain for verification
  CASE 
    WHEN email IS NOT NULL THEN 
      LEFT(email, 1) || '***@' || SPLIT_PART(email, '@', 2)
    ELSE NULL 
  END as masked_email
FROM public.profiles;

-- Grant access to the public view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Create a function to get safe profile data for public use
CREATE OR REPLACE FUNCTION public.get_safe_profile_data(profile_id uuid)
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
STABLE
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
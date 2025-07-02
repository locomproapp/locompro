
-- Fix the status check constraint to allow all valid statuses
ALTER TABLE public.offers DROP CONSTRAINT IF EXISTS offers_status_check;

-- Add the correct constraint with all valid status values
ALTER TABLE public.offers ADD CONSTRAINT offers_status_check 
  CHECK (status IN ('pending', 'accepted', 'rejected', 'finalized'));

-- Also make sure the buy_request_offers table has the correct constraint
ALTER TABLE public.buy_request_offers DROP CONSTRAINT IF EXISTS buy_request_offers_status_check;

-- Add the correct constraint for buy_request_offers
ALTER TABLE public.buy_request_offers ADD CONSTRAINT buy_request_offers_status_check 
  CHECK (status IN ('pending', 'accepted', 'rejected', 'finalized'));

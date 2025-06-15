
ALTER TABLE public.buy_requests
ADD COLUMN condition TEXT,
ADD COLUMN reference_url TEXT,
ADD COLUMN images TEXT[];

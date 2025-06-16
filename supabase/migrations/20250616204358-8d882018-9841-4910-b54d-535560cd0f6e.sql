
-- 1. Eliminar la tabla actual y todas sus dependencias
DROP TABLE IF EXISTS public.user_posts CASCADE;
DROP TABLE IF EXISTS public.buy_requests CASCADE;

-- 2. Crear la nueva tabla con la estructura limpia que especificaste
CREATE TABLE public.buy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  min_price NUMERIC NOT NULL,
  max_price NUMERIC NOT NULL,
  zone TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('nuevo', 'usado', 'cualquiera')),
  reference_url TEXT,
  images TEXT[] DEFAULT '{}',
  reference_image TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Configurar RLS
ALTER TABLE public.buy_requests ENABLE ROW LEVEL SECURITY;

-- 4. Crear las policies exactas que especificaste
CREATE POLICY "Users can insert their own buy requests" 
ON public.buy_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buy requests" 
ON public.buy_requests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view buy requests" 
ON public.buy_requests 
FOR SELECT 
USING (true);

-- 5. Crear trigger para updated_at
CREATE OR REPLACE FUNCTION update_buy_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_buy_requests_updated_at
  BEFORE UPDATE ON public.buy_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_buy_requests_updated_at();

-- 6. Función para auto-completar reference_image
CREATE OR REPLACE FUNCTION set_reference_image()
RETURNS TRIGGER AS $$
BEGIN
  IF array_length(NEW.images, 1) > 0 THEN
    NEW.reference_image = NEW.images[1];
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_reference_image_trigger
  BEFORE INSERT OR UPDATE ON public.buy_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_reference_image();

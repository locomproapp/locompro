
-- Crear nueva tabla user_posts desde cero con estructura limpia
CREATE TABLE public.user_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  min_price NUMERIC,
  max_price NUMERIC,
  zone TEXT NOT NULL,
  condition TEXT NOT NULL DEFAULT 'cualquiera',
  reference_url TEXT,
  images TEXT[] DEFAULT '{}',
  reference_image TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_posts ENABLE ROW LEVEL SECURITY;

-- Policies simples y claras
CREATE POLICY "Anyone can view active posts" 
  ON public.user_posts 
  FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Users can create their own posts" 
  ON public.user_posts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
  ON public.user_posts 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
  ON public.user_posts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_user_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_posts_updated_at
  BEFORE UPDATE ON public.user_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_posts_updated_at();

-- Índices para performance
CREATE INDEX idx_user_posts_user_id ON public.user_posts(user_id);
CREATE INDEX idx_user_posts_status ON public.user_posts(status);
CREATE INDEX idx_user_posts_created_at ON public.user_posts(created_at DESC);

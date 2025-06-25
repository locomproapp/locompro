
-- Modificar las políticas RLS de la tabla profiles para permitir lectura pública
-- Primero eliminamos las políticas restrictivas existentes
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;

-- Crear una nueva política que permita a todos los usuarios autenticados leer información básica de perfiles
CREATE POLICY "Anyone can view basic profile info"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- También permitir a usuarios anónimos ver información básica para publicaciones públicas
CREATE POLICY "Anonymous users can view basic profile info" 
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);

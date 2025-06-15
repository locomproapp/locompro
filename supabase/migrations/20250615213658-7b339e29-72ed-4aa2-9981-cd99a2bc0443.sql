
-- Eliminar policies redundantes/permisivas para SELECT
DROP POLICY IF EXISTS "Anyone can view active buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Users can view all buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Todos pueden ver solicitudes activas" ON public.buy_requests;
DROP POLICY IF EXISTS "Los usuarios pueden ver todas las buy requests" ON public.buy_requests;

-- Crear una sola policy clara y eficiente para seleccionar/publicar solicitudes activas (para todos los roles)
CREATE POLICY "Anyone can view active buy requests"
  ON public.buy_requests
  FOR SELECT
  USING (status = 'active');

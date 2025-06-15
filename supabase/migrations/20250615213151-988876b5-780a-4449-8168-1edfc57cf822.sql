
-- Eliminar policies viejas si existen (en español o inglés)
DROP POLICY IF EXISTS "Users can create their own buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Los usuarios pueden crear sus propias solicitudes de compra" ON public.buy_requests;

DROP POLICY IF EXISTS "Users can update their own buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Los usuarios pueden editar sus propias solicitudes de compra" ON public.buy_requests;

DROP POLICY IF EXISTS "Users can delete their own buy requests" ON public.buy_requests;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias solicitudes de compra" ON public.buy_requests;

-- Crear policies nuevas optimizadas
CREATE POLICY "Users can create their own buy requests"
  ON public.buy_requests
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own buy requests"
  ON public.buy_requests
  FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own buy requests"
  ON public.buy_requests
  FOR DELETE
  USING ((select auth.uid()) = user_id);

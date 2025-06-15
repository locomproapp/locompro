
-- Eliminar policies anteriores si existen (en español o inglés)
DROP POLICY IF EXISTS "Sellers can create offers" ON public.offers;
DROP POLICY IF EXISTS "Los vendedores pueden crear ofertas" ON public.offers;

DROP POLICY IF EXISTS "Users can update their own offers" ON public.offers;
DROP POLICY IF EXISTS "Los usuarios pueden editar sus propias ofertas" ON public.offers;

DROP POLICY IF EXISTS "Users can delete their own offers" ON public.offers;
DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias ofertas" ON public.offers;

-- Crear policies nuevas y optimizadas
CREATE POLICY "Sellers can create offers"
  ON public.offers
  FOR INSERT
  WITH CHECK ((select auth.uid()) = seller_id);

CREATE POLICY "Users can update their own offers"
  ON public.offers
  FOR UPDATE
  USING ((select auth.uid()) = seller_id);

CREATE POLICY "Users can delete their own offers"
  ON public.offers
  FOR DELETE
  USING ((select auth.uid()) = seller_id);

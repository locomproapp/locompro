
-- Elimina la policy anterior si existe (puede estar en español o inglés)
DROP POLICY IF EXISTS "Users can view their own offers" ON public.offers;
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias ofertas" ON public.offers;

-- Crea la policy corregida usando (select auth.uid())
CREATE POLICY "Users can view their own offers"
  ON public.offers
  FOR SELECT
  USING ((select auth.uid()) = seller_id);



-- Elimina la policy anterior si existe (puede estar en español o inglés)
DROP POLICY IF EXISTS "Sellers can create offers" ON public.offers;
DROP POLICY IF EXISTS "Los vendedores pueden crear ofertas" ON public.offers;

-- Crea la policy corregida usando (select auth.uid())
CREATE POLICY "Sellers can create offers"
  ON public.offers
  FOR INSERT
  WITH CHECK ((select auth.uid()) = seller_id);

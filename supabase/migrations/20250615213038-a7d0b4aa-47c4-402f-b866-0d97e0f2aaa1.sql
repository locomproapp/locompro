
-- Elimina la policy anterior si existe (puede estar en español o inglés)
DROP POLICY IF EXISTS "Buyers can create reviews for their transactions" ON public.reviews;
DROP POLICY IF EXISTS "Los compradores pueden crear reseñas para sus transacciones" ON public.reviews;

-- Crea la policy corregida usando (select auth.uid())
CREATE POLICY "Buyers can create reviews for their transactions"
  ON public.reviews
  FOR INSERT
  WITH CHECK ((select auth.uid()) = buyer_id);



-- Elimina policies antiguas (en inglés y español) si existen
DROP POLICY IF EXISTS "Buyers can view offers for their buy_requests" ON public.offers;
DROP POLICY IF EXISTS "Los compradores pueden ver ofertas de sus solicitudes" ON public.offers;

DROP POLICY IF EXISTS "Buyers can update offers on their buy_requests" ON public.offers;
DROP POLICY IF EXISTS "Los compradores pueden editar ofertas en sus solicitudes" ON public.offers;

DROP POLICY IF EXISTS "Sellers can view their own offers" ON public.offers;
DROP POLICY IF EXISTS "Los vendedores pueden ver sus propias ofertas" ON public.offers;

DROP POLICY IF EXISTS "Sellers can update their own offers" ON public.offers;
DROP POLICY IF EXISTS "Los vendedores pueden editar sus propias ofertas" ON public.offers;

DROP POLICY IF EXISTS "Users can create offers" ON public.offers;
DROP POLICY IF EXISTS "Los usuarios pueden crear ofertas" ON public.offers;

DROP POLICY IF EXISTS "Anyone can view public offers" ON public.offers;
DROP POLICY IF EXISTS "Users can view all offers" ON public.offers;
DROP POLICY IF EXISTS "Users can view their own offers" ON public.offers;
DROP POLICY IF EXISTS "Users can update their own offers" ON public.offers;

-- Policies usando (select auth.uid()) correctamente

-- Los compradores pueden ver ofertas de sus buy_requests
CREATE POLICY "Buyers can view offers for their buy_requests"
  ON public.offers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.buy_requests
      WHERE public.buy_requests.id = buy_request_id
        AND public.buy_requests.user_id = (select auth.uid())
    )
  );

-- Los compradores pueden editar ofertas de sus buy_requests (por ejemplo, cambiar status/rechazar)
CREATE POLICY "Buyers can update offers on their buy_requests"
  ON public.offers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.buy_requests
      WHERE public.buy_requests.id = buy_request_id
        AND public.buy_requests.user_id = (select auth.uid())
    )
  );

-- Los vendedores pueden ver sus propias ofertas
CREATE POLICY "Sellers can view their own offers"
  ON public.offers
  FOR SELECT
  USING ((select auth.uid()) = seller_id);

-- Los vendedores pueden editar sus propias ofertas
CREATE POLICY "Sellers can update their own offers"
  ON public.offers
  FOR UPDATE
  USING ((select auth.uid()) = seller_id);

-- Los usuarios pueden crear ofertas sólo si son ellos el seller
CREATE POLICY "Users can create offers"
  ON public.offers
  FOR INSERT
  WITH CHECK ((select auth.uid()) = seller_id);


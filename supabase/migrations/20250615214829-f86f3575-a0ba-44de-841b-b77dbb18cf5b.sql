
-- Eliminar política INSERT duplicada de sellers (¡las dos hacen lo mismo!)
DROP POLICY IF EXISTS "Sellers can create offers" ON public.offers;

-- Estandarización: dejamos solo las políticas en inglés y necesarias

-- (Ya existen, solo se borran los duplicados y las que están en español)
DROP POLICY IF EXISTS "Los compradores pueden ver ofertas de sus solicitudes" ON public.offers;
DROP POLICY IF EXISTS "Los compradores pueden editar ofertas en sus solicitudes" ON public.offers;
DROP POLICY IF EXISTS "Los vendedores pueden ver sus propias ofertas" ON public.offers;
DROP POLICY IF EXISTS "Los vendedores pueden editar sus propias ofertas" ON public.offers;
DROP POLICY IF EXISTS "Los usuarios pueden crear ofertas" ON public.offers;

-- Nota: No borro las políticas "Buyers can view offers for their buy_requests", "Buyers can update offers on their buy_requests",
-- "Sellers can view their own offers", "Sellers can update their own offers", "Users can create offers" (en inglés), porque son las correctas.

-- Fin: ahora solo queda una política para INSERT, y solo las que realmente son necesarias para SELECT y UPDATE en inglés.

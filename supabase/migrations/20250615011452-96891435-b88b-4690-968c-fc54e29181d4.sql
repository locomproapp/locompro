
-- Eliminar primero los datos asociados a los usuarios en otras tablas para evitar restricciones de integridad.

DELETE FROM reviews;
DELETE FROM offers;
DELETE FROM buy_requests;
DELETE FROM posts;
DELETE FROM profiles;

-- Finalmente, eliminar todos los usuarios de Supabase Auth.
DELETE FROM auth.users;

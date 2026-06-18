-- ============================================================
-- Seed do admin. RODE DEPOIS que o admin já tiver se registrado
-- (signup com o email abaixo), para a linha existir em auth.users/profiles.
-- ============================================================

update profiles
set role = 'admin'
where id = (
  select id from auth.users
  where lower(email) = lower('gujannuzzi17@gmail.com')
  limit 1
);
